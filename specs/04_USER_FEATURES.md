# 04 — User Features (screen-by-screen)

**Shell** (`app/dashboard/layout.tsx`): persistent **frosted near-black sidebar** (Home, Courses, Leaderboard, Goodies, Tasks, Profile) with a sliding ember pill on the active item + a **frosted topbar** (⌘K search, animated points pill, avatar menu). Content area scrolls; sidebar and topbar are fixed. All surfaces follow `06_UI_DESIGN_SYSTEM.md` (dark-only, glass, ember gradients, Poppins).

---

## 4.1 Dashboard Home (`/dashboard`)

**Goal:** personalized landing that gets the user back into learning in one tap.

- **Hero banner** — "Welcome back, {firstName}" (from the Supabase user's `full_name`/email) + a short rotating line about the university (from a `settings`/announcements source or hardcoded initially).
- **Resume learning card** — the most recently active in-progress enrollment: course thumbnail, "Continue Lesson X of Y", an animated `ProgressRing`. Deep-links to the lesson player. Premium glass card with ember glow on hover.
- **Stats row** — total points, current rank, courses completed, active streak. `StatCard`s with animated count-up.
- **This semester** — horizontal scroll of courses in the user's current semester with per-course progress bars.
- **Next reward teaser** — "180 pts to unlock the Semester 1 hoodie 🎁" with a gradient progress bar toward the nearest `reward_rule` the user hasn't earned.
- **Announcements / recent activity** — feed of "You earned 100 pts", "New course added", etc. (recent `point_ledger` rows + admin announcements).

Data: one server-component fetch joining enrollments + progress + nearest rule + recent ledger rows.

---

## 4.2 Courses (`/dashboard/courses`)

- **Semester sections via a macOS-style segmented control.** Each semester is a section; within it, a responsive grid of course cards.
- **Course card (`CourseCard`):** thumbnail, title, difficulty chip, points reward, and state: `Enroll` / `Resume (62%)` / `Completed ✓`.
- **Filters:** All / Enrolled / Completed; difficulty; search.
- **Locking (optional):** a semester can require the previous one complete — show a lock overlay + tooltip.

**Course detail (`/dashboard/courses/[courseId]`):**
- Left: lesson list (checkmarks for completed, current highlighted).
- Right: **lesson player** — video embed / markdown article / quiz.
- "Mark complete" → `POST /api/complete-lesson`. On the final lesson, `canvas-confetti` burst + "Course complete, +100 pts" `RewardUnlockModal`.

---

## 4.3 Leaderboard (`/dashboard/leaderboard`)

- Read from the `leaderboard` view (public, RLS-safe — only name, avatar, points, xp, rank).
- **Toggle** (segmented control): All-time / This season (season window from `settings.season_start`).
- **Podium** for top 3 (bigger glass cards, medal accents in ember/gold), then a ranked table (`LeaderboardRow`).
- **"You" row pinned** even if outside the visible page, with your rank highlighted in ember.
- Optional: filter to same-semester peers.

---

## 4.4 Claim Goodies (`/dashboard/goodies`)

Two tabs:
1. **Unlocked** — benchmark rewards from `earned_rewards` (certificates to download, badges, free goodies). Each has a `Claim` button → creates a `gift_claim` (`POST /api/claim-gift`).
2. **Point Shop** — gifts with `point_cost`. `GiftCard` shows cost vs. your balance; `Claim` disabled if insufficient or out of stock.

- **My claims** section shows claim status (requested → approved → shipped) as a `ClaimStepper`.
- Certificates render as downloadable PDFs (generated server-side, stored in the `certificates` Storage bucket; signed URL from `certificates.pdf_url`).

---

## 4.5 Tasks (`/dashboard/tasks`)

- List of `task_assignments` grouped by status: **To do / Submitted / Done**.
- Each `TaskItem`: title, description, criteria, points, due date (with "due in 2 days" chips).
- **Tick to complete:** checkbox → if `requires_approval` is false, immediately `done` + award points (server); if true, moves to `submitted` and waits for admin. Strike-through animation on complete.
- Optional evidence upload (image/link) stored in the `task-evidence` bucket, attached to the assignment.
- Overdue tasks styled distinctly (rose accent); completed tasks collapse.

---

## 4.6 Profile (`/dashboard/profile`)

- Avatar, name, joined date, current semester, XP level + title (see `07`).
- **Achievements wall** — earned badges as a glass grid.
- **Points history** — the `point_ledger` as a timeline.
- **Certificates** — downloadable list.
- Editable shipping address (`profiles.shipping_info`, used to pre-fill gift claims).
- **Sign out** (reuses the existing `SignOutButton`).
