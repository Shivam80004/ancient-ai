# Ancient AI Academy — Full SEO Optimization Plan

A phased, actionable plan to take the site from "basic metadata" to a fully
search-optimized Next.js 16 (App Router) application. Every task references real
files in this repo and follows the framework's native SEO primitives
(Metadata API, `sitemap.ts`, `robots.ts`, `opengraph-image`, JSON-LD).

> Stack context: Next.js 16.1.1 (App Router, Turbopack) · React 19 · Tailwind v4 ·
> Supabase auth. Public marketing routes are SSG/ISR; `dashboard/*`, `admin/*`,
> `auth/*`, `onboarding` are private/dynamic.

---

## 0. Current state audit

### What already exists
- `app/layout.tsx` sets a solid base: `metadataBase`, `title.template`
  (`%s | Ancient AI Academy`), default description, `openGraph`, `twitter`
  (`summary_large_image`), `alternates.canonical: '/'`, and `icons.icon`.
- Most marketing pages export `metadata` (title + description): `about`,
  `courses` (layout), `events-and-mentorship`, `free-resources` (layout),
  `retreats`, `our-inspiration`, `privacy-policy`, `terms-of-service`,
  `cookie-policy`, `contact-us` (layout), `login`, `signup`.
- Dynamic routes use `generateMetadata`: `courses/[slug]`,
  `events-and-mentorship/[slug]`, `free-resources/[slug]`, `retreats/[slug]`.

### Gaps to close (the work in this plan)
1. **No `sitemap.xml`** — no `app/sitemap.ts`.
2. **No `robots.txt`** — no `app/robots.ts`.
3. **No structured data** — zero JSON-LD (`Organization`, `Course`, `Event`,
   `BreadcrumbList`, `FAQPage`, `WebSite` + Sitelinks search box).
4. **No OpenGraph/Twitter images** — no `opengraph-image`, no default social
   share image; link previews are text-only.
5. **No PWA/web manifest** — no `app/manifest.ts`.
6. **`images.unoptimized: true`** in `next.config.ts` — disables the Next.js
   image pipeline, hurting LCP and Core Web Vitals. Raw `<img>` tags are used
   (e.g. `courses/[slug]/page.tsx`) instead of `next/image`.
7. **Private routes are indexable** — `dashboard/*`, `admin/*`, `auth/*`,
   `onboarding`, `login`, `signup`, `google-login`, `email-password` should be
   `noindex`.
8. **Incomplete per-page metadata** — `who-we-are` has none; the home page
   (`app/page.tsx`) only sets a title (`'AncientAi Academy'`, inconsistent
   brand casing) and relies on layout defaults; dynamic routes set only
   title/description (no `openGraph`, no per-page `canonical`).
9. **No canonical strategy** beyond `/`.
10. **`NEXT_PUBLIC_SITE_URL` is not set** in `.env`, so `metadataBase` falls
    back to a hardcoded default — canonical/OG URLs may be wrong per environment.
11. **Multiple lockfiles** (`D:\apps\package-lock.json` above the workspace)
    trigger a Turbopack root warning and can affect builds/deploys.

---

## 1. Guiding principles

- Use the **Next.js Metadata API** — no manual `<head>` tags.
- Every indexable page gets: unique `title`, unique `description`
  (≤ ~155 chars), self-referencing `canonical`, and `openGraph`/`twitter` with
  an image.
- Every non-public page gets `robots: { index: false, follow: false }`.
- One **single source of truth** for the site URL and brand strings.
- Structured data on every page type that has a schema.org match.
- Performance (Core Web Vitals) is treated as an SEO ranking factor, not an
  afterthought.

---

## Phase 1 — Foundations (site-wide primitives)

**Goal:** the crawl/index infrastructure Google expects.

1. **Site config constant.** Create `lib/seo/config.ts` exporting `SITE_URL`
   (from `process.env.NEXT_PUBLIC_SITE_URL`), `SITE_NAME`, `SITE_DESCRIPTION`,
   default social handles, and the default OG image path. Reuse everywhere.
2. **Set `NEXT_PUBLIC_SITE_URL`** in `.env` (and the deploy environment) to the
   canonical production origin. Update `layout.tsx`'s `metadataBase` to read it.
3. **`app/robots.ts`** — allow all public routes; disallow `/dashboard`,
   `/admin`, `/auth`, `/api`, `/onboarding`, `/login`, `/signup`,
   `/google-login`, `/email-password`. Point `sitemap` at `${SITE_URL}/sitemap.xml`.
4. **`app/sitemap.ts`** — enumerate static public routes + generate dynamic
   entries from the data sources already used by the pages:
   - `lib/course-data.ts` → `COURSES` (`/courses/[slug]`)
   - events → `MENTORSHIPS` (`/events-and-mentorship/[slug]`)
   - free resources → `RESOURCES` (`/free-resources/[slug]`)
   - retreats → `TRIPS_DATA` (`/retreats/[slug]`)
   Set sensible `changeFrequency`/`priority`/`lastModified`.
5. **`app/manifest.ts`** — name, short_name, theme_color `#1A1614`,
   background_color, icons (see Phase 4), `display: standalone`.
6. **Normalize the home page metadata** in `app/page.tsx` — fix brand casing to
   `Ancient AI Academy`, add a real description and `openGraph`.

**Deliverables:** `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, shared
SEO config, corrected env + home metadata.

---

## Phase 2 — Per-page metadata completeness

**Goal:** every indexable route is uniquely and fully described; every private
route is excluded.

1. **Fill the gaps:** add `metadata` to `app/who-we-are/page.tsx`; enrich the
   home page.
2. **Enrich dynamic routes** (`courses`, `events-and-mentorship`,
   `free-resources`, `retreats` `[slug]` `generateMetadata`) to also emit:
   - `alternates.canonical` (self-referencing, e.g. `/courses/${slug}`)
   - `openGraph` (title, description, `type: 'article'`/`'website'`,
     per-item image where available — courses have `heroImage`)
   - `twitter` card with the same image.
3. **`noindex` private areas.** Add `export const metadata = { robots: { index:
   false, follow: false } }` to the layouts that own private trees:
   `app/dashboard/layout.tsx`, `app/admin/layout.tsx`, and auth pages
   (`login`, `signup`, `google-login`, `email-password`), plus `onboarding`.
4. **Canonical helper.** Add `canonical(path)` in `lib/seo/config.ts` and use it
   consistently so canonicals are always absolute + correct per environment.
5. **Metadata QA pass** — verify title lengths (≤ ~60 chars visible),
   description length, and that no two pages share the same title/description.

---

## Phase 3 — Structured data (JSON-LD)

**Goal:** rich results eligibility and stronger entity understanding.

Create small typed helpers in `lib/seo/structured-data.ts` that return schema
objects, rendered via a `<script type="application/ld+json">` component
(`components/seo/JsonLd.tsx`).

1. **Organization + WebSite** (site-wide, in `app/layout.tsx` or home): logo,
   name, URL, `sameAs` social links, and a `WebSite` node with a Sitelinks
   `SearchAction` if/when search exists.
2. **Course** schema on `/courses/[slug]` (name, description, provider =
   Organization, image; add `hasCourseInstance` if sessions/dates exist).
3. **Event** schema on `/events-and-mentorship/[slug]` (name, dates, location or
   `eventAttendanceMode`, organizer).
4. **BreadcrumbList** on all nested routes (courses, events, resources,
   retreats detail pages).
5. **FAQPage** where Q&A content exists (e.g. course/retreat pages, contact).
6. **CreativeWork / Article** for `our-inspiration` and long-form content.
7. Validate every type with Google's Rich Results Test and Schema.org validator.

---

## Phase 4 — Social sharing & icons

**Goal:** compelling, correct link previews and a full favicon set.

1. **Default OG image** — add `app/opengraph-image.tsx` (Next.js `ImageResponse`,
   1200×630, on-brand: charcoal `#1A1614` + ember `#f15906`, logo + tagline).
   Add matching `app/twitter-image.tsx`.
2. **Per-section OG images** — colocated `opengraph-image.tsx` in key route
   groups (`courses`, `events-and-mentorship`, `retreats`) or dynamic OG using
   the item's `heroImage`.
3. **Favicon/app icons** — generate `app/icon.png` (and sizes), `app/apple-icon.png`;
   consolidate the current `favicon.ico` + `/favicon.png`. Wire into
   `manifest.ts`.
4. Confirm previews in the Facebook Sharing Debugger, Twitter/X Card Validator,
   and LinkedIn Post Inspector.

---

## Phase 5 — Performance & Core Web Vitals

**Goal:** fast LCP/CLS/INP — a direct ranking factor and UX win.

1. **Re-enable image optimization.** Reconsider `images.unoptimized: true` in
   `next.config.ts`. If it was set for a static export/host limitation, either
   remove it (preferred) or adopt a loader/CDN. Configure `images.remotePatterns`
   for Supabase-hosted media.
2. **Migrate raw `<img>` to `next/image`** where it matters for LCP — starting
   with hero images in `courses/[slug]`, `retreats/[slug]`, and home hero
   (`components/home/HeroBanner`). Provide `width`/`height`/`sizes` + `priority`
   on above-the-fold images to prevent CLS.
3. **Fonts.** Confirm `display: 'swap'` across all `next/font` families
   (Array already sets it; verify Poppins/Oswald/Geist) and subset/limit weights
   actually used to cut payload.
4. **Media weight.** Audit large assets in `public/` (`.jpeg` heroes, `videos/`);
   compress, serve modern formats (WebP/AVIF), lazy-load below-the-fold video,
   add `poster` frames.
5. **Third-party/animation cost.** Ensure GSAP/Lenis/three.js work is client-only
   and code-split; keep heavy 3D off critical marketing pages or lazy-load it.
6. **Measure** with Lighthouse + PageSpeed Insights (field + lab) before/after;
   track LCP < 2.5s, CLS < 0.1, INP < 200ms.
7. **Fix the multiple-lockfile warning** (remove/relocate the stray
   `D:\apps\package-lock.json` or set `turbopack.root`) for reliable builds.

---

## Phase 6 — Content & on-page SEO

**Goal:** the words and structure crawlers read.

1. **Heading hierarchy** — exactly one `<h1>` per page, logical `h2/h3` nesting.
   Audit marketing components for decorative headings that skip levels.
2. **Image alt text** — meaningful `alt` on content images; empty `alt=""` for
   purely decorative ones. Audit `components/home/*`, gallery, course/retreat
   heroes.
3. **Internal linking** — descriptive anchor text; cross-link courses ↔ events
   ↔ resources; ensure the footer/nav expose the key routes to crawlers.
4. **Semantic HTML & a11y** — `main`/`nav`/`article`/`section`, `aria` where
   needed (per `DESIGN.md`). Accessibility and SEO overlap heavily.
5. **Keyword mapping** — one primary intent per page; reflect it in title, H1,
   first paragraph, and slug. Avoid cannibalization across similar pages.
6. **404/redirects** — friendly `app/not-found.tsx`; add `redirects()` in
   `next.config.ts` for any renamed/legacy URLs.

---

## Phase 7 — Verification, monitoring & launch

**Goal:** prove it works and keep it working.

1. **Google Search Console** — verify the property (DNS or a metadata token via
   `verification` in `layout.tsx`), submit `sitemap.xml`, monitor Coverage +
   Core Web Vitals + Enhancements (structured data).
2. **Bing Webmaster Tools** — verify and submit the sitemap.
3. **Analytics** — confirm privacy-compliant analytics is in place for organic
   traffic tracking.
4. **Automated checks** — add a Lighthouse CI (or a simple pre-deploy script)
   and re-validate JSON-LD after content changes.
5. **Regression guardrails** — a short checklist (below) in PR review so new
   pages ship with complete metadata.

---

## Definition of done (site-wide checklist)

- [ ] `NEXT_PUBLIC_SITE_URL` set; `metadataBase` reads it.
- [ ] `robots.txt` and `sitemap.xml` served and correct.
- [ ] `manifest.webmanifest` + full icon set.
- [ ] Every public page: unique title + description + self-canonical + OG/Twitter image.
- [ ] Every private route (`dashboard`, `admin`, `auth`, `onboarding`) is `noindex`.
- [ ] JSON-LD present and valid for Organization, Course, Event, Breadcrumb, FAQ.
- [ ] Default + key per-section OG images render correctly in social debuggers.
- [ ] Image optimization enabled; hero images use `next/image` with `priority`.
- [ ] Lighthouse: SEO 100, Performance ≥ 90 mobile, CWV in the green.
- [ ] GSC + Bing verified, sitemaps submitted, no coverage errors.

---

## Suggested new/changed files (reference)

| File | Purpose | Phase |
|---|---|---|
| `lib/seo/config.ts` | Site URL, brand strings, `canonical()` helper | 1 |
| `.env` | `NEXT_PUBLIC_SITE_URL` | 1 |
| `app/robots.ts` | robots.txt | 1 |
| `app/sitemap.ts` | dynamic sitemap from data sources | 1 |
| `app/manifest.ts` | web manifest | 1 |
| `app/page.tsx` | fix/enrich home metadata | 1 |
| `app/who-we-are/page.tsx` | add metadata | 2 |
| `app/**/[slug]/*` | enrich `generateMetadata` (OG + canonical) | 2 |
| `app/dashboard/layout.tsx`, `app/admin/layout.tsx`, auth pages | `noindex` | 2 |
| `lib/seo/structured-data.ts`, `components/seo/JsonLd.tsx` | JSON-LD | 3 |
| `app/opengraph-image.tsx`, `app/twitter-image.tsx` | social images | 4 |
| `app/icon.png`, `app/apple-icon.png` | app icons | 4 |
| `next.config.ts` | image optimization, redirects | 5 |
| `app/not-found.tsx` | custom 404 | 6 |

---

## Execution order (recommended)

1. Phase 1 (foundations) — highest impact, unblocks crawling/indexing.
2. Phase 2 (metadata completeness) — closes the biggest content gaps.
3. Phase 4 (social/icons) — quick wins, visible in shares.
4. Phase 3 (structured data) — rich-result eligibility.
5. Phase 5 (performance) — ongoing, measurable.
6. Phase 6 (on-page content) — continuous.
7. Phase 7 (verify & monitor) — after each phase and at launch.

Phases 1, 2, and 4 are independent and could be delivered in a single pass;
3, 5, and 6 are larger and benefit from their own iterations.
