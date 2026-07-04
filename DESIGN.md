# Ancient AI Academy — Design System

The single source of truth for the look & feel of this project. When building or
editing any UI, follow this document so every screen feels like one product.

**Brand in one line:** A warm, dark, cinematic wellness brand — "a better human
experience for the mind, body, and soul." Deep charcoal canvas, glowing ember
accents, elegant editorial type, glassmorphism, and rounded, calm surfaces.

---

## 1. Color Palette

Brand tokens are defined in [app/globals.css](app/globals.css) under `@theme inline`
and are available as Tailwind utility classes (e.g. `bg-primary`, `text-accent-cool`).

### Brand tokens (use these first)

| Token / class            | Hex       | Name          | Use for                                   |
| ------------------------ | --------- | ------------- | ----------------------------------------- |
| `--color-bg-deep`        | `#1A1614` | Deep Charcoal | Primary page background                   |
| `--color-primary`        | `#8C4A32` | Burnt Sienna  | Warm secondary surfaces, borders, accents |
| `--color-accent-warm`    | `#f15906` | Golden Ember  | **Primary accent** — CTAs, highlights, links |
| `--color-accent-cool`    | `#A8B9B9` | Misty Slate   | Muted/secondary text                      |
| `--color-support-rose`   | `#B58271` | Dusty Rose    | Soft supporting accent                    |
| `--text-main`            | `#F5F5F5` | Off-white     | Primary text on dark                      |
| `--text-muted`           | `#A8B9B9` | Misty Slate   | Muted text                                |

### Supporting neutrals (as used across the app)

- Near-black backgrounds: `#0a0a0a`, `bg-black`, `bg-zinc-900/95`
- Warm dark gradient surface: `from-[#221b17] via-[#1A1614] to-[#0d0a09]`
- Input/well background: `#0f0c0b`

### The signature "Ember" gradient

This orange→red diagonal gradient is the brand's hero flourish (magnetic button,
CTA cards, footer sunrise glow). Reuse it verbatim for large brand moments:

```css
background: linear-gradient(261.26deg,
  rgba(246, 32, 3, 0) -11.86%, #fc964c -5.96%, #fc964c 5.45%,
  #f62003 30.99%, rgba(246, 32, 3, 0) 62.85%, #f62003 101.39%, #fd7c34 103.82%);
```

For buttons and smaller accents, the simpler Tailwind gradient is the standard:

```
bg-gradient-to-r from-orange-600 to-red-600
```

### Text opacity scale (on dark backgrounds)

Text color is almost always white at a controlled opacity — do not introduce new greys:

| Opacity        | Use                                  |
| -------------- | ------------------------------------ |
| `text-white`   | Primary headings & emphasis          |
| `text-white/80`| Body copy                            |
| `text-white/70`| Secondary body / nav links (resting) |
| `text-white/40`| Section labels, footer headings      |
| `text-white/30`| Fine print, copyright, placeholders  |

`text-[#A8B9B9]` (Misty Slate) is the alternative for muted body text.

---

## 2. Typography

Fonts are wired up in [app/layout.tsx](app/layout.tsx) as CSS variables.

| Family        | Variable            | Role                                             |
| ------------- | ------------------- | ------------------------------------------------ |
| **Poppins**   | `--font-poppins`    | **Default body font** (set on `body`)            |
| **Oswald**    | `--font-oswald`     | Display / headings — condensed, editorial        |
| **Array**     | `--font-array`      | Local display font for special brand moments     |
| Geist / Mono  | `--font-geist-*`    | Utility / monospace (IDs, code, technical values)|

Apply non-default families inline where needed:
`style={{ fontFamily: "var(--font-oswald)" }}`.

### Type scale & weights

- **Hero / big headings:** `text-3xl md:text-5xl lg:text-6xl`, weight `font-light`
  with a `font-semibold` highlight span for emphasis.
- **Section / card headings:** `text-lg`–`text-3xl`, weight `font-medium` (often Oswald).
- **Body:** `text-sm md:text-base`, `leading-relaxed`.
- **Eyebrows / labels:** `text-xs`, `font-semibold`, `uppercase`, wide tracking.

### Tracking (letter-spacing)

Uppercase labels always get generous tracking:

- `tracking-widest` — footer column headings
- `tracking-[0.2em]` — bottom-bar / metadata labels
- `tracking-[0.3em]` — form eyebrows
- `tracking-[0.4em]` — brand wordmark

**Rule:** any all-caps label must be small, semibold, and letter-spaced.

---

## 3. Spacing & Layout

- **Page container:** `container mx-auto` or `max-w-7xl mx-auto`, horizontal padding
  `px-4` / `px-6` (mobile) scaling to `px-10` on large screens.
- **Section rhythm:** vertical padding `py-20 md:py-32`.
- **Because the navbar is fixed/floating**, full-page views start content low —
  auth/dashboard use `pt-28`–`pt-36` so nothing hides behind the nav.
- **Grid gaps:** `gap-6 md:gap-8` for cards; `gap-10 md:gap-20` for wide footer columns.
- **Inner card padding:** `p-6` (compact) → `p-8` → `p-10`/`p-12` (feature panels).
- **Card grids:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` (quick links) or
  `lg:grid-cols-2` (feature cards).

---

## 4. Shape, Border & Elevation

### Border radius (rounded, never sharp)

| Radius            | Use                                          |
| ----------------- | -------------------------------------------- |
| `rounded-full`    | Buttons, pills, toggles, badges, avatars     |
| `rounded-2xl`     | Inputs, small tiles                          |
| `rounded-3xl`     | Cards                                        |
| `rounded-[24px]`–`rounded-[36px]` | Large feature panels / auth cards |

### Borders

- Hairline dividers & card edges: `border border-white/10` (sometimes `/5`).
- Hover/active emphasis: bump to `border-white/20` or `border-[#f15906]/40`.

### Shadows / glow

- Card elevation: `shadow-[0_25px_70px_rgba(0,0,0,0.5)]` (scale the blur/spread up
  to `0_45px_120px` for hero panels).
- Ember glow on hover: `hover:shadow-[0_20px_50px_rgba(241,89,6,0.12)]`.
- **Ambient background glows:** absolutely-positioned blurred radial circles behind
  content, e.g.
  `bg-[radial-gradient(circle,_rgba(241,89,6,0.22),_transparent_70%)] blur-3xl`.
  Mark them `aria-hidden="true"` and `pointer-events-none`.

---

## 5. Glassmorphism (the core surface treatment)

Floating UI (navbar, cards, buttons over imagery) uses translucent glass:

```
bg-white/[0.04]  →  bg-black/20     (translucent fill)
backdrop-blur-md / backdrop-blur-xl  (frost)
border border-white/10               (edge catch)
```

Navbar reference: `bg-black/20 backdrop-blur-md border border-white/10 shadow-2xl`.

---

## 6. Components

### Buttons

1. **Primary (Ember):** `rounded-full bg-gradient-to-r from-orange-600 to-red-600
   text-white shadow-lg shadow-orange-900/40 hover:brightness-110`. Padding
   `px-4 py-3` (form) or `px-8 py-3` (marketing).
2. **Magnetic button:** the `.btn-magnetic` component in `globals.css` — the premium
   hero CTA with the full ember gradient and a sliding fill on hover.
3. **Glass / secondary:** `rounded-full border border-white/15 bg-white/[0.06]
   text-white hover:bg-white/[0.12]`.
4. **Google OAuth:** solid white pill with the 4-color Google mark
   (see [components/auth/AuthPrimitives.tsx](components/auth/AuthPrimitives.tsx)).

### Inputs

`rounded-2xl border border-white/10 bg-[#0f0c0b] px-4 py-3 text-white
placeholder-white/30 shadow-inner shadow-black/40`, focus ring
`focus:border-[#f15906] focus:ring-2 focus:ring-[#f15906]/30`. Always inside a
`text-sm font-medium` label.

### Cards

Warm gradient surface `bg-gradient-to-br from-[#221b17] to-[#0d0a09]`, `rounded-3xl`,
`border border-white/10`, generous padding, and a subtle hover lift
(`gsap` scale `1.02` on marketing cards, or ember border/shadow on links).

### Badges / pills

`rounded-full px-3 py-1 text-xs font-semibold` on a translucent fill
(`bg-white/10` or `bg-emerald-500/20` for status).

---

## 7. Motion

- **Library:** GSAP (`gsap`, `ScrollTrigger`) + Lenis smooth scroll (see
  [components/SmoothScroll](components/SmoothScroll.tsx)). `SplitText` is used for
  animated heading reveals.
- **Micro-interactions:** Tailwind `transition` with `duration-300`–`duration-700`.
- **Hover scale:** `1.02` via GSAP `power2.out`.
- **Easing:** `power2.out` / `power3.out` (GSAP); `cubic-bezier(0.625, 0.05, 0, 1)`
  for the magnetic button fill.
- Keep motion smooth and calm — this is a wellness brand, not a hype product.

---

## 8. Iconography & Imagery

- Logos live in `/public`: `logo-plain.png`, `logo.svg` (use `brightness-0 invert`
  to force white on dark where needed).
- Prefer simple inline SVG (e.g. the Google mark) over icon libraries.
- Photography/video is cinematic and warm-toned to match the ember palette.

---

## 9. Accessibility & Conventions

- Maintain contrast: primary text `#F5F5F5`/white on `#1A1614`. Don't drop body
  text below `text-white/70`.
- Decorative glows/gradients: `aria-hidden="true"` + `pointer-events-none`.
- Status messages: `role="status"` + `aria-live="polite"` (see `AuthMessage`).
- Toggle buttons: `aria-pressed`.
- Everything is responsive-first: design mobile (`grid-cols-1`), enhance at
  `sm:` / `md:` / `lg:`.
- Reference files with real components before inventing new patterns:
  [components/auth/AuthShell.tsx](components/auth/AuthShell.tsx),
  [components/Navbar.jsx](components/Navbar.jsx),
  [components/home/CallToAction.jsx](components/home/CallToAction.jsx),
  [components/Footer.jsx](components/Footer.jsx).

---

## 10. Quick copy-paste recipes

**Themed page shell**
```tsx
<main className="relative min-h-screen w-full overflow-hidden bg-[#1A1614] text-[#F5F5F5]">
  <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,_rgba(241,89,6,0.18),_transparent_70%)] blur-3xl" />
  <div className="relative z-10 mx-auto max-w-7xl px-6 pt-36 pb-24 lg:px-10">
    {/* content */}
  </div>
</main>
```

**Primary button**
```tsx
<button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 transition hover:brightness-110">
  Get started
</button>
```

**Glass card**
```tsx
<div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_25px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl">
  {/* ... */}
</div>
```

**Eyebrow + heading**
```tsx
<p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">Section</p>
<h2 className="mt-3 text-3xl font-medium text-white" style={{ fontFamily: "var(--font-oswald)" }}>
  Heading in Oswald
</h2>
```
