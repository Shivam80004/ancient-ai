# 02 — Data Model (Supabase / Postgres)

All tables use `uuid` PKs and `created_at timestamptz default now()`. Run these as migrations. RLS is **enabled on every table**.

> **How to apply:** the Supabase MCP tools are connected in this workspace — use `apply_migration` (one logical migration per call), `list_tables` to inspect before/after, and `get_advisors` to catch missing RLS/policies. Then generate types (bottom of file). Prefer applying to a dev branch first (`create_branch`) if available.

## Entities at a glance

```
profiles ──< enrollments >── courses ──> semesters
   │             │              │
   │             │              └──< lessons
   │             └──< lesson_completions
   ├──< task_assignments >── tasks
   ├──< point_ledger
   ├──< earned_rewards >── reward_rules
   ├──< streaks
   └──< gift_claims >── gifts / certificates
settings (singleton: season_start, etc.)
```

## SQL

```sql
-- ---------- PROFILES ----------
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user','admin')),
  total_points int not null default 0,   -- denormalized cache of ledger sum
  xp int not null default 0,             -- lifetime XP (persists across seasons)
  shipping_info jsonb,                   -- pre-fills gift claims
  created_at timestamptz default now()
);

-- auto-create profile on signup (works for Google AND email/password)
create function handle_new_user() returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- ---------- CURRICULUM ----------
create table semesters (
  id uuid primary key default gen_random_uuid(),
  title text not null,           -- "Semester 1: Foundations"
  order_index int not null,
  is_published boolean default false
);

create table courses (
  id uuid primary key default gen_random_uuid(),
  semester_id uuid references semesters on delete cascade,
  title text not null,
  description text,
  thumbnail_url text,
  difficulty text default 'beginner',
  points_reward int not null default 100,   -- awarded on course completion
  order_index int not null,
  is_published boolean default false
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses on delete cascade,
  title text not null,
  content_type text default 'video' check (content_type in ('video','article','quiz')),
  content_url text,
  body text,                       -- markdown for articles
  duration_minutes int default 0,
  order_index int not null
);

-- ---------- PROGRESS ----------
create table enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles on delete cascade,
  course_id uuid references courses on delete cascade,
  status text default 'in_progress' check (status in ('in_progress','completed')),
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  unique (user_id, course_id)
);

create table lesson_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles on delete cascade,
  lesson_id uuid references lessons on delete cascade,
  completed_at timestamptz default now(),
  unique (user_id, lesson_id)      -- idempotent
);

-- ---------- TASKS ----------
create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  points_reward int not null default 25,
  criteria text,                   -- human-readable "what counts as done"
  requires_approval boolean default false,   -- admin must confirm
  due_date timestamptz,
  is_active boolean default true
);

create table task_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles on delete cascade,
  task_id uuid references tasks on delete cascade,
  status text default 'pending' check (status in ('pending','submitted','done','rejected')),
  evidence_url text,               -- optional proof upload (Storage)
  completed_at timestamptz,
  unique (user_id, task_id)
);

-- ---------- POINTS (source of truth) ----------
create table point_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles on delete cascade,
  amount int not null,             -- + earn, - spend
  reason text not null,            -- 'course_complete','task_done','gift_claim','admin_adjust','streak_bonus'...
  ref_id uuid,                     -- id of the course/task/gift involved
  created_at timestamptz default now()
);

-- keep profiles.total_points in sync (and bump lifetime xp on positive earns)
create function sync_points() returns trigger language plpgsql as $$
begin
  update profiles set
    total_points = (select coalesce(sum(amount),0) from point_ledger where user_id = new.user_id),
    xp = xp + greatest(new.amount, 0)
  where id = new.user_id;
  return new;
end; $$;
create trigger on_ledger_change after insert on point_ledger
  for each row execute function sync_points();

-- ---------- STREAKS ----------
create table streaks (
  user_id uuid primary key references profiles on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_active_date date
);

-- ---------- SETTINGS (singleton) ----------
create table settings (
  id int primary key default 1 check (id = 1),
  season_start timestamptz,        -- leaderboard "This season" window start
  season_name text
);

-- ---------- REWARDS / RULES ----------
create table reward_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rule_type text not null check (rule_type in
    ('points_threshold','course_count','semester_complete','task_count','streak_days')),
  threshold int not null,          -- e.g. 500 points, or 3 courses
  semester_id uuid references semesters, -- for semester_complete
  reward_kind text check (reward_kind in ('gift','certificate','badge')),
  reward_ref uuid,                 -- gift/cert/badge id granted
  is_active boolean default true
);

create table gifts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  point_cost int,                  -- null = benchmark-only, not purchasable
  stock int,                       -- null = unlimited
  is_active boolean default true
);

create table earned_rewards (      -- unlocked but maybe not yet claimed
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles on delete cascade,
  rule_id uuid references reward_rules,
  reward_kind text,
  reward_ref uuid,
  earned_at timestamptz default now(),
  unique (user_id, rule_id)
);

create table gift_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles on delete cascade,
  gift_id uuid references gifts,
  status text default 'requested' check (status in
    ('requested','approved','shipped','rejected')),
  shipping_info jsonb,
  admin_note text,
  created_at timestamptz default now(),
  resolved_at timestamptz
);

create table certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles on delete cascade,
  title text not null,             -- "Semester 1 Completion"
  semester_id uuid references semesters,
  pdf_url text,                    -- generated + stored in Supabase Storage
  issued_at timestamptz default now()
);
```

## RLS policies (pattern)

```sql
alter table profiles enable row level security;
alter table enrollments enable row level security;
-- ...enable on ALL tables above

-- Profile: read/update own row
create policy "own profile read"   on profiles for select using (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Users read/write only their own rows
create policy "own enrollments" on enrollments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own completions" on lesson_completions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own ledger read" on point_ledger
  for select using (auth.uid() = user_id);
-- NOTE: inserts to point_ledger happen via service-role only (server). No user insert policy.

-- Published curriculum is readable to logged-in users
create policy "read published semesters" on semesters for select using (is_published = true);
create policy "read published courses"   on courses   for select using (is_published = true);
create policy "read lessons of published course" on lessons for select using (
  exists (select 1 from courses c where c.id = lessons.course_id and c.is_published)
);

-- Leaderboard: expose a limited public view instead of full profiles
create view leaderboard as
  select id, full_name, avatar_url, total_points, xp,
         rank() over (order by total_points desc) as rank
  from profiles where role = 'user';

-- Admin bypass helper
create function is_admin() returns boolean language sql security definer as $$
  select exists(select 1 from profiles where id = auth.uid() and role = 'admin');
$$;
create policy "admin full courses" on courses for all using (is_admin());
-- repeat the admin policy on every table admins must manage
-- (semesters, lessons, tasks, task_assignments, reward_rules, gifts, gift_claims, certificates, earned_rewards)
```

## Storage buckets

- `course-thumbnails` (public read) — course cover art.
- `certificates` (private; signed URLs) — generated PDFs.
- `task-evidence` (private) — optional user task proof.

## Types

Generate TS types after migrations (note: **`types/` at root**, not `src/types/`):
```bash
supabase gen types typescript --project-id <id> > types/db.ts
# or via MCP: generate_typescript_types
```
