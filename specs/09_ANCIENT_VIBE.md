# 09 — Ancient Vibe (Reels Feed)

A cinematic, full-screen **vertical reels** experience. Admins curate short posts; learners scroll,
watch, like, and passively earn points. Dark near-black + ember theme, Poppins, per `06_UI_DESIGN_SYSTEM.md`.

## Post types

Every post is one of:

- **`video`** — an uploaded MP4 (Supabase Storage now, S3-ready — we only store a URL), with an optional
  poster image and a caption.
- **`image`** — an uploaded image with a caption.
- **`text`** — a caption-only card rendered on the signature ember-gradient background.

## User feed — `/dashboard/vibe`

- Full-height **snap-scroll** column, one post per screen (CSS `scroll-snap-type: y mandatory`).
- Videos **autoplay muted when they scroll into view** (IntersectionObserver), pause when out of view;
  tapping toggles play/pause; a mute button toggles sound. Image/text posts simply display.
- Per-post overlay: caption (bottom-left), **like** heart + count (bottom-right), and a mute toggle.
- **Earn points for watching**: the first time a user dwells on a post (~2s in view), the client calls
  `POST /api/vibe/view`. The server idempotently records the view and awards `points_reward`, then runs
  the rewards engine. One award per user per post — re-watching never double-awards.
- Likes are optimistic; toggling calls a server action.

## Admin — `/admin/vibe`

- A list of posts (newest first) with a **publish toggle**, inline **Edit**, and **Delete** — matching
  the curriculum manager conventions, with every field labeled.
- **Add post** form: **kind** (video / image / text), media upload (video → `VideoUpload`,
  image → `ImageUpload`, both targeting the `vibe-media` bucket), an optional poster (for video),
  caption, points reward, and publish toggle.
- Only **published** posts appear in the learner feed (enforced by RLS, not the client).

## Navigation

- The dashboard sidebar (`AppSidebar`) gets an **Ancient Vibe** item.
- The admin shell (`AdminShell`) gets an **Ancient Vibe** management item.

## Data model

```sql
create table public.vibe_posts (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('video','image','text')),
  media_url text,                       -- video/image URL; null for text
  poster_url text,                      -- optional poster for videos
  caption text,
  points_reward int not null default 5, -- awarded once per user on first watch
  like_count int not null default 0,    -- cached; kept in sync by trigger
  is_published boolean default false,
  order_index int not null default 0,
  created_at timestamptz default now()
);

create table public.vibe_likes (
  user_id uuid references public.profiles on delete cascade,
  post_id uuid references public.vibe_posts on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, post_id)
);

create table public.vibe_views (
  user_id uuid references public.profiles on delete cascade,
  post_id uuid references public.vibe_posts on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, post_id)        -- idempotency guard for the watch award
);
```

A `sync_vibe_likes()` trigger on `vibe_likes` (insert/delete) recomputes `vibe_posts.like_count`.

## RLS

- `vibe_posts`: read where `is_published = true` (authenticated); `is_admin()` full.
- `vibe_likes`: own rows (`auth.uid() = user_id`); `is_admin()` full.
- `vibe_views`: own **select**; **inserts happen server-side via the service role only** (never the
  client) — the same rule that protects `point_ledger`.

## Points

`points_reward` (default 5) is awarded once per post per user via `POST /api/vibe/view`, written to
`point_ledger` with reason `vibe_view` and `ref_id = post id`. It is idempotent (guarded by the
`vibe_views` primary key plus a ledger check) and flows through `sync_points` → `evaluateRewards`
exactly like every other earn event.

## Anti-abuse

Awards happen only through the server route after a genuine in-view dwell; the `vibe_views` PK and the
ledger `ref_id` check make replays and double-clicks no-ops.

## Storage

A public `vibe-media` bucket holds videos and images. Writes are admin-only (the existing storage
`admin insert/update/delete media` policies are extended to include `vibe-media`); public read is via
the bucket's public URLs.

## Out of scope (v1)

Comments and bookmarks/saves. Likes + watch-points only.
