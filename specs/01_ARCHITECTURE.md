# 01 — Architecture

## Folder structure (App Router — **root-level `app/`, no `src/`**)

This repo does **not** use a `src/` directory. Everything lives at the project root. New dashboard/admin work slots into the existing tree:

```
app/
  page.tsx                     # existing landing page
  layout.tsx                   # root layout: fonts + <Navbar/> + <SmoothScroll> + <Footer/>
  globals.css                  # Tailwind v4 + brand tokens + shadcn tokens
  login/page.tsx               # existing — email/password + Google
  signup/page.tsx              # existing
  auth/callback/route.ts       # existing — exchanges ?code= for session, redirects to next
  dashboard/
    layout.tsx                 # NEW: app shell (frosted sidebar + topbar), auth guard
    page.tsx                   # Home (currently a placeholder to be replaced)
    courses/
      page.tsx                 # semester grid
      [courseId]/page.tsx      # course detail + lesson player
    leaderboard/page.tsx
    goodies/page.tsx
    tasks/page.tsx
    profile/page.tsx
  admin/
    layout.tsx                 # NEW: admin guard (server role check)
    page.tsx                   # admin overview
    courses/page.tsx
    rules/page.tsx
    claims/page.tsx
    tasks/page.tsx
    users/page.tsx
    users/[userId]/page.tsx
  api/                         # NEW: route handlers for sensitive mutations
    complete-lesson/route.ts
    claim-gift/route.ts
    ai-companion/route.ts      # streams from Anthropic (see 07)
lib/
  supabase/
    browser-client.ts          # EXISTS → getSupabaseBrowserClient()
    server-client.ts           # EXISTS → createSupabaseServerClient()
    admin.ts                   # NEW: service-role client (server only!)
  rewards/
    engine.ts                  # NEW: rule evaluation (service-role)
  auth/
    guard.ts                   # NEW: requireUser(), requireAdmin()
  gamification/
    data.ts                    # (prototype) static mock data — replace with DB reads
components/
  ui/                          # shadcn primitives (Card.tsx already exists — note casing)
  dashboard/                   # AppSidebar, TopBar, StatCard, ProgressRing, cards…
types/
  db.ts                        # generated via `supabase gen types`
```

> **Naming reality:** the existing browser/server client exports are **`getSupabaseBrowserClient()`** and **`createSupabaseServerClient()`** — not `client.ts`/`server.ts`. Reuse them; add only `lib/supabase/admin.ts`.
>
> **Casing gotcha (Windows):** `components/ui/Card.tsx` (capital C) already exists as a marketing card. shadcn's generated file would be `card.tsx` — on the case-insensitive `D:` filesystem these collide. Either keep the custom card under a different name or build dashboard surfaces from a custom `GlassCard` instead of shadcn's `card`.

## Auth & roles

- Keep the existing Google OAuth + email/password as-is. On first login, a Postgres trigger inserts a row into `profiles` (see `02`).
- Roles live in `profiles.role` (`'user' | 'admin'`). **Never** store role in client state or trust a JWT claim alone — always verify server-side.
- `app/dashboard/layout.tsx`: `createSupabaseServerClient()` → `getUser()`; redirect to `/login` if no session. (This mirrors the guard already used in `app/dashboard/page.tsx`.)
- `app/admin/layout.tsx`: fetch the profile server-side; if `role !== 'admin'`, redirect to `/dashboard`.
- Centralize both in `lib/auth/guard.ts`:
  ```ts
  export async function requireUser() { /* getUser() or redirect('/login') */ }
  export async function requireAdmin() { /* requireUser() + profiles.role === 'admin' or redirect('/dashboard') */ }
  ```
- Sensitive mutations (award points, approve claims, deduct points) run **only** through Route Handlers / Server Actions. The service-role client is used **exclusively** inside `app/api/*` / `app/admin` server code after `requireAdmin()`, never exposed to the browser.
- **Optional `middleware.ts`** (root) to refresh the Supabase session cookie on navigation (recommended by `@supabase/ssr`). Not present today; add if you hit stale-session issues.

## Data flow for a point-earning event

```
User finishes lesson
  → POST /api/complete-lesson (server)
     → verify session (createSupabaseServerClient) + enrollment
     → insert lesson_completion (idempotent, unique(user_id, lesson_id))
     → recompute course progress
     → if course now complete → award course points (point_ledger insert, service-role)
     → run rewards engine → unlock any newly-earned benchmarks
     → return updated progress
  → client revalidates UI (router.refresh / revalidatePath)
```

Points are **never** written from the browser. The client only reports "I finished lesson X"; the server decides what that's worth.

## Supabase clients

- **Browser client** (`getSupabaseBrowserClient`) — reads that RLS already protects (own progress, public leaderboard view).
- **Server client** (`createSupabaseServerClient`) — SSR reads + user-scoped mutations, bound to the request's cookies.
- **Admin / service-role client** (`lib/supabase/admin.ts`, NEW) — bypasses RLS; used only inside `app/api/*` and admin server actions after `requireAdmin()`.

## Env vars

`.env` currently defines only the two public vars. **Add the service-role key** (server-only, never `NEXT_PUBLIC`):

```
NEXT_PUBLIC_SUPABASE_URL=            # present
NEXT_PUBLIC_SUPABASE_ANON_KEY=       # present
SUPABASE_SERVICE_ROLE_KEY=           # ADD — server only, never NEXT_PUBLIC
ANTHROPIC_API_KEY=                   # ADD — for the AI course companion (server only)
```

## Dependencies to install (not yet present)

```bash
npm i framer-motion canvas-confetti cmdk recharts @react-pdf/renderer zod
```

Already installed: `@supabase/ssr`, `@supabase/supabase-js`, Radix primitives, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `lucide-react`, `gsap`, `lenis`, Tailwind v4.
