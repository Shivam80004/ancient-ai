# Ancient AI Academy

Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + Supabase auth. A warm, dark,
cinematic wellness brand.

## Design system

All UI work MUST follow the project design system. It is documented in full here:

@DESIGN.md

Key reminders (see DESIGN.md for the details):
- Dark canvas `#1A1614`, ember accent `#f15906`, orange→red gradient CTAs.
- Poppins body, Oswald headings; rounded surfaces; glassmorphism; calm GSAP motion.
- Text is white at controlled opacity — don't introduce arbitrary greys.

## Auth

- Supabase clients: [lib/supabase/browser-client.ts](lib/supabase/browser-client.ts)
  (client) and [lib/supabase/server-client.ts](lib/supabase/server-client.ts) (server).
- Pages: `/login`, `/signup` → redirect to `/dashboard` on success.
  OAuth returns through [app/auth/callback/route.ts](app/auth/callback/route.ts).
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` drive the connection.
