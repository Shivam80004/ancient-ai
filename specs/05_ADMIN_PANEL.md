# 05 — Admin Panel (`/admin`)

Gated by `requireAdmin()` (from `lib/auth/guard.ts`) in `app/admin/layout.tsx` — a **server-side** `profiles.role` check that redirects non-admins to `/dashboard`. All admin mutations use the **service-role client** (`lib/supabase/admin.ts`) inside server route handlers / server actions — **never** the browser. Same dark near-black glassmorphic design system as the user app (`06`).

---

## 5.1 Admin Overview (`/admin`)

KPI cards + charts (charts via `recharts`):
- Total users, active this week, total points issued, pending gift claims, pending task approvals.
- Enrollment trend, most popular courses, completion rate per semester.
- Quick links to unresolved claims and task approvals (the daily to-do).

---

## 5.2 Curriculum management (`/admin/courses`)

- **Semesters:** create/edit/reorder, publish toggle.
- **Courses:** CRUD; set `points_reward`, thumbnail (upload to the `course-thumbnails` Storage bucket), difficulty, publish toggle, drag to reorder within a semester.
- **Lessons:** CRUD within a course; type (video/article/quiz), content URL or markdown body, duration, order. A simple quiz builder (question, options, correct answer) if quizzes are used.

---

## 5.3 Reward rules (`/admin/rules`)

The no-code rule builder — this is where "how a user earns rewards/points" is configured.

- Table of `reward_rules` with create/edit.
- Form fields: name, `rule_type` (points_threshold / course_count / task_count / semester_complete / streak_days), threshold value, target semester (if applicable), reward kind (gift / certificate / badge), reward reference (pick a gift/cert/badge), active toggle.
- Also manage **gifts** here: title, image, `point_cost` (blank = benchmark-only), stock.
- Preview: "How many users currently satisfy this rule?" (dry-run count via the service-role client).

---

## 5.4 Claims management (`/admin/claims`)

- Queue of `gift_claims` filtered by status.
- Each row: user, gift, requested date, shipping info.
- Actions: **Approve / Reject / Mark shipped**, with an admin note. Rejecting a point-shop claim **refunds points** (positive `point_ledger` entry, `reason='claim_refund'`). Admin can also **revoke / uproot** a granted gift (adds a reversing ledger entry + sets the claim `rejected`) — this is the "admin can uproot gift" requirement.

---

## 5.5 Users (`/admin/users`, `/admin/users/[userId]`)

Admin has full visibility ("see all people's profiles and their details").

- **List:** searchable/sortable table — name, email, role, total points, courses completed, tasks done, last active.
- **Detail page:** everything about one user —
  - Enrollments + per-course progress bars.
  - Task assignments + statuses.
  - Full `point_ledger`.
  - Earned rewards, claims, certificates.
  - Actions: assign a task, manually grant/deduct points (writes a ledger entry with `reason='admin_adjust'`), promote to admin, issue a certificate manually.

---

## 5.6 Task assignment (`/admin/tasks`)

- CRUD tasks (title, description, criteria, points, `requires_approval`, due date).
- Assign to: everyone, a semester cohort, or specific users → bulk-inserts `task_assignments`.
- Approval queue for `submitted` tasks that require approval → Approve (award points + `done`) / Reject.

---

## Permissions summary

| Capability | User | Admin |
|---|---|---|
| See own progress | ✓ | ✓ |
| See others' full profiles | ✗ | ✓ |
| Create courses / rules | ✗ | ✓ |
| Award / deduct points | ✗ (never) | ✓ (via ledger) |
| Approve / uproot gifts | ✗ | ✓ |
| Approve tasks | ✗ | ✓ |

> **Bootstrapping the first admin:** there's no UI to make yourself admin. After migrations, set your row manually — via Supabase MCP `execute_sql`: `update profiles set role='admin' where id='<your-auth-uid>';` (or the SQL editor).
