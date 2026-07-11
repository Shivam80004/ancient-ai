# 08 — Build Roadmap

Phased so you can build from where the project actually is today to a full product.

## Phase 0.0 — Unblock the environment (do this FIRST) 🚨
- [ ] **Fix the file-loss issue.** Files under `components/` and `lib/` were repeatedly disappearing between edits — almost certainly a **cloud-sync client (OneDrive/Dropbox/GDrive) or antivirus** watching `D:\apps`. Move the repo out of any synced folder, or add an AV/sync **exclusion** for `d:\apps\ancient-ai-final`. Until this is fixed, any code you write may vanish.
- [ ] **Remove the stray lockfile** at `d:\apps\package-lock.json` (keep the project's own `d:\apps\ancient-ai-final\package-lock.json`). This clears Next's "inferred workspace root" warning. Optionally set `turbopack.root` in `next.config.ts`.

## Phase 0 — Foundation
- [x] Landing page (Next.js 16 App Router)
- [x] Supabase project + **Google OAuth + email/password** auth (`/login`, `/signup`, `/auth/callback`)
- [x] Dashboard route exists (`app/dashboard/page.tsx`) + static prototype (`DashboardClient.tsx`)
- [x] shadcn deps installed (Radix, cva, clsx, tailwind-merge, tw-animate-css, lucide-react)
- [ ] `npm i framer-motion canvas-confetti cmdk recharts @react-pdf/renderer zod`
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` (+ `ANTHROPIC_API_KEY`) to `.env`
- [ ] Run migrations from `02_DATA_MODEL.md` (schema + RLS + triggers) — via Supabase MCP `apply_migration`
- [ ] Confirm `profiles` auto-create trigger fires for a new Google **and** email/password signup
- [ ] Generate TS types → `types/db.ts` (MCP `generate_typescript_types`)
- [ ] Add `lib/supabase/admin.ts` (service-role) + `lib/auth/guard.ts` (`requireUser`, `requireAdmin`)
- [ ] Seed yourself as admin: `update profiles set role='admin' where id='<uid>'`

## Phase 1 — Shell & Home
- [ ] `app/dashboard/layout.tsx`: frosted near-black sidebar + topbar, auth guard (per `06`)
- [ ] Replace `app/dashboard/page.tsx` with the real Home (resume card, stat cards, next-reward teaser) wired to Supabase
- [ ] `GlassCard`, `AppSidebar`, `TopBar`, `StatCard`, `ProgressRing` components
- [ ] Hide the marketing Navbar/Footer on `/dashboard` (already handled via pathname check) or move dashboard into its own route group

## Phase 2 — Courses (core value)
- [ ] Semester + course grid from DB (published only), segmented control
- [ ] Enroll flow
- [ ] Course detail + lesson player (video/article first; quiz later)
- [ ] `POST /api/complete-lesson` → completion + course-complete points award (idempotent)
- [ ] Progress rings / bars wired to real completion data + confetti on course complete

## Phase 3 — Points, Rewards, Tasks
- [ ] Verify `point_ledger` + `sync_points()` trigger (total_points & xp)
- [ ] Rewards engine (`lib/rewards/engine.ts`) + `reward_rules` evaluation (service-role)
- [ ] Streaks table + daily update on activity
- [ ] Tasks tab (assign, tick, approval path)
- [ ] Goodies tab (unlocked + point shop) + `POST /api/claim-gift`
- [ ] Certificate PDF generation → `certificates` Storage bucket

## Phase 4 — Leaderboard & Profile
- [ ] `leaderboard` view + podium + pinned "you" row
- [ ] Season toggle (`settings.season_start`)
- [ ] Profile: achievements wall, ledger timeline, certificates, shipping address, XP level/title

## Phase 5 — Admin Panel
- [ ] `app/admin/layout.tsx` guard + overview KPIs (recharts)
- [ ] Curriculum CRUD (semesters/courses/lessons) + Storage thumbnail uploads
- [ ] Reward rules + gifts management (+ dry-run "who satisfies this rule")
- [ ] Claims queue (approve/reject/ship/**uproot** + refund)
- [ ] Users list + user detail (full visibility, manual point adjust, assign task, promote admin)
- [ ] Task management + approval queue

## Phase 6 — Cool features & polish
- [ ] ⌘K command palette (`cmdk`)
- [ ] Reward-unlock confetti + card reveal
- [ ] Streaks + daily quest UX
- [ ] AI course companion (server route → Anthropic Claude, streamed)
- [ ] Realtime points/leaderboard (Supabase Realtime)
- [ ] Shareable certificate/profile OG cards
- [ ] Empty states, keyboard nav, reduced-motion, QA pass

## Suggested tech choices
- **UI:** Tailwind v4 + shadcn/ui + Framer Motion + lucide-react icons
- **Charts (admin):** Recharts
- **Confetti:** canvas-confetti
- **Command palette:** cmdk
- **PDF certs:** @react-pdf/renderer or a serverless HTML→PDF
- **AI companion:** Anthropic Claude (latest model) via a server route
- **Data:** Server Components for reads; Server Actions / Route Handlers for mutations
- **Validation:** zod on every server action / route-handler input

## Definition of done per feature
1. RLS verified (a user cannot read another user's rows).
2. Points only mutated server-side (never from the browser).
3. Idempotent (double-click / replay safe).
4. Loading + empty + error states.
5. Looks right in the one dark theme; keyboard accessible; honors reduced-motion.
