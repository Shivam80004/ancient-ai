# Ancient AI University — Dashboard Technical Specification

> Master index. Read this first, then follow the numbered files in order.
> **Stack (actual):** Next.js 16 (App Router) + React 19 + Supabase (Postgres, Auth, Storage, RLS) + Tailwind CSS **v4** + shadcn/ui + Poppins.
> **Auth already implemented:** Google OAuth **and** email/password (login + sign up). A dashboard route exists with a static gamified prototype.
> **Look & feel:** iPhone/Mac-style **premium glassmorphism**, **dark-only**, near-black canvas with **orange (ember) gradients**, **Poppins** throughout. See `06_UI_DESIGN_SYSTEM.md`.

    ## What we're building

A gamified, university-style learning platform — *not* a plain LMS. Learning is organized by **University → Semester → Course → Lessons**. Users earn **reward points** from completing courses and tasks, climb a **leaderboard**, and **claim goodies / gifts / certifications** as they hit benchmarks. An **admin panel** manages courses, defines the reward rules, approves gift claims, and sees every user's full progress.

## Core surfaces

| Surface | Route | Who | Purpose |
|---|---|---|---|
| **Dashboard Home** | `/dashboard` | User | Personalized welcome, "Resume learning", stats, next-reward teaser, announcements |
| **Courses** | `/dashboard/courses` | User | Browse by semester, enroll, take lessons, track completion |
| **Leaderboard** | `/dashboard/leaderboard` | User | Ranked by points; season/all-time; peer filter |
| **Claim Goodies** | `/dashboard/goodies` | User | Redeem points/benchmarks for gifts + certificates |
| **Tasks** | `/dashboard/tasks` | User | Assigned tasks with criteria; tick when done |
| **Profile** | `/dashboard/profile` | User | Achievements, points history, certificates, shipping info |
| **Admin Panel** | `/admin/*` | Admin | CRUD courses, reward rules, approve/uproot claims, view all users |

## File map

- `00_OVERVIEW.md` — this file
- `01_ARCHITECTURE.md` — folder structure (root `app/`), routing, data flow, auth/roles, Supabase clients, deps
- `02_DATA_MODEL.md` — full Supabase schema (SQL), RLS policies, triggers, views
- `03_REWARDS_ENGINE.md` — how points, benchmarks, and rule evaluation work
- `04_USER_FEATURES.md` — Home, Courses, Leaderboard, Goodies, Tasks, Profile (per-screen spec)
- `05_ADMIN_PANEL.md` — admin screens, permissions, workflows
- `06_UI_DESIGN_SYSTEM.md` — the dark near-black + ember glassmorphic look, components, motion
- `07_COOL_FEATURES.md` — differentiators & interactive ideas
- `08_BUILD_ROADMAP.md` — phased milestones to build from where we are now

## Current state (July 2026 — read before planning work)

- ✅ Marketing landing site; global Navbar/Footer + Lenis smooth-scroll; Tailwind v4; brand tokens in `app/globals.css`.
- ✅ Auth: Google OAuth **and** email/password. Routes: `app/login`, `app/signup`, `app/auth/callback/route.ts`. Clients: `lib/supabase/browser-client.ts` (`getSupabaseBrowserClient`) and `lib/supabase/server-client.ts` (`createSupabaseServerClient`).
- 🟡 `app/dashboard/page.tsx` renders a simple server "quick links" page. `app/dashboard/DashboardClient.tsx` is a **static** gamified prototype (tabs: home/courses/achievements/leaderboard/settings) — useful as a visual reference; it is **not** yet wired to real data.
- 🟡 shadcn/ui dependencies are installed (Radix primitives, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `lucide-react`).
- ❌ No database migrations yet — no `profiles`, curriculum, points, or rewards tables; no RLS.
- ❌ No `app/admin`, no `app/api`, no `middleware.ts`, no service-role key in `.env`.
- ❌ Not yet installed (needed later): `framer-motion`, `canvas-confetti`, `cmdk`, `recharts`, a PDF lib (`@react-pdf/renderer`), `zod`.

> ⚠️ **Environment blocker:** during setup, files under `components/` and `lib/` were observed disappearing between edits (likely a cloud-sync client or antivirus on the `D:` drive). **Fix this before implementation** — see `08_BUILD_ROADMAP.md` Phase 0.0.

## Guiding principles

1. **Single source of truth for progress.** Courses, tasks, points, and claims all resolve through the `point_ledger` + progress tables so benchmarks are computed in one place.
2. **Rules are data, not code.** Admins define reward rules in a table; the engine evaluates them. No redeploy to change a threshold.
3. **RLS everywhere.** Users only ever see their own rows (except the public leaderboard view). Admin access is a server-side role check, never a client flag.
4. **Server-first.** Use Next.js Server Components + Server Actions / Route Handlers for anything touching points or claims. Never trust the client to award points.
5. **One design language.** Every screen follows `06_UI_DESIGN_SYSTEM.md` — dark, near-black, ember-gradient, glassmorphic, Poppins.
