# 06 — UI Design System (iPhone/Mac premium · dark-only · black + ember)

The dashboard should feel like a **premium native Apple app** — think iOS/macOS System Settings, Fitness, Music, Raycast, Linear — but in a **single confident dark theme**: near-black canvas, warm **ember-orange** accents and gradients, frosted glass surfaces, soft layered depth, and quiet spring motion. **No light mode.** Font is **Poppins** everywhere.

> This is the single source of truth for the dashboard look. It intentionally uses a **near-black** canvas (Apple-style), which is a touch darker than the landing site's warm charcoal in the root `DESIGN.md` — the dashboard is its own premium surface.

## 1. Foundations

- **Type:** **Poppins** (already wired as `var(--font-poppins)` in `app/layout.tsx`). Weights **400 / 500 / 600** (occasionally 700 for big numerals). Tight, confident headings; relaxed line-height for body. No Oswald/SF in the dashboard.
- **Spacing:** 8px grid. Rooms breathe — card padding **20–32px**, **16px** between grid items, **24px** section gaps.
- **Radius:** cards **`rounded-2xl`/`rounded-3xl`** (16–24px), inputs/buttons **10–12px**, **`rounded-full`** on pills/avatars/toggles.
- **Depth (Apple-soft):** faint 1px border + a soft layered shadow + a 1px top inner highlight. Never harsh drop shadows.

## 2. Color tokens (dark-only)

Define as CSS variables in `app/globals.css` (extend the existing `@theme inline`). These are the dashboard tokens:

```css
/* Canvas & surfaces */
--dash-canvas:      #0A0A0A;                    /* app background (true near-black) */
--dash-surface-1:   rgba(255,255,255,0.03);     /* base glass fill */
--dash-surface-2:   rgba(255,255,255,0.06);     /* raised glass (hover, popovers) */
--dash-border:      rgba(255,255,255,0.08);     /* hairline edge */
--dash-border-strong: rgba(255,255,255,0.14);   /* hover/active edge */

/* Accent — ember */
--ember:            #f15906;                     /* primary accent */
--ember-600:        #ea580c;
--ember-red:        #dc2626;                     /* gradient end */

/* Text (white at opacity) */
--tx-1: rgba(255,255,255,0.95);  /* headings/emphasis */
--tx-2: rgba(255,255,255,0.70);  /* body */
--tx-3: rgba(255,255,255,0.50);  /* secondary */
--tx-4: rgba(255,255,255,0.40);  /* labels */
--tx-5: rgba(255,255,255,0.30);  /* fine print / placeholder */
--tx-muted: #A8B9B9;             /* misty slate (alt muted) */
```

**Ember gradient (buttons, active states, progress):**
```
bg-gradient-to-r from-orange-600 to-red-600      /* standard */
```
**Signature hero gradient (big brand moments — reward unlock, hero banner):**
```css
linear-gradient(261.26deg, rgba(246,32,3,0) -11.86%, #fc964c -5.96%, #fc964c 5.45%,
  #f62003 30.99%, rgba(246,32,3,0) 62.85%, #f62003 101.39%, #fd7c34 103.82%);
```

**Semantic (low saturation on dark):** success `emerald-400/500`, warning `amber-400`, danger `rose-500`.

## 3. The signature "premium glass card"

Every panel is this surface. Reusable as a `GlassCard` component:

```
bg-white/[0.04] backdrop-blur-xl
border border-white/[0.08]
rounded-3xl
shadow-[0_20px_50px_rgba(0,0,0,0.5)]
+ inset top highlight:  shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
hover: border-white/[0.14] + ember glow  hover:shadow-[0_20px_60px_rgba(241,89,6,0.12)]
```
Add a subtle top gradient sheen (`from-white/[0.06] to-transparent`) on hero cards for the "polished glass" look.

## 4. Signature Apple/iOS elements

- **Vibrancy / frosted sidebar + topbar:** `bg-[#0A0A0A]/70 backdrop-blur-xl border-white/[0.08]` so content faintly bleeds through.
- **Segmented controls** (iOS-style) for Courses semesters and the Leaderboard All-time/Season toggle — a pill track with a sliding ember-filled thumb.
- **Sidebar hover-fill pill** that **slides** between items (Framer Motion `layoutId`), ember gradient on the active item.
- **Quiet controls:** small, precise, low-contrast until hover (like macOS traffic-light restraint).
- **Inspector/detail panels** slide in from the right (course detail, admin user detail) where it fits, rather than full navigation.
- **Points pill** in the topbar: rounded-full, ember icon, count-up value.

## 5. Motion (the "cool" comes from restraint)

- **Spring-based** transitions (`framer-motion`) — 200–300ms, gentle overshoot; respect `prefers-reduced-motion`.
- Sidebar selection pill via shared `layoutId`.
- **Count-up** numbers on stats; **ProgressRing** animates `stroke-dashoffset` on mount.
- **Confetti burst** (`canvas-confetti`) on course completion and reward unlock — a genuine dopamine moment, paired with a card-flip reveal.
- Hover: cards lift ~2px + ember glow eases in. Nothing bounces aggressively.

## 6. Components to build (shadcn/ui base + custom)

- `AppSidebar`, `TopBar` (frosted, ⌘K, points pill, avatar menu)
- `GlassCard` (the base surface above)
- `StatCard` (icon, count-up value, label)
- `ProgressRing` (SVG, animated stroke-dashoffset)
- `CourseCard`, `SemesterSection` (segmented control)
- `LeaderboardPodium`, `LeaderboardRow`
- `GiftCard`, `ClaimStepper`
- `TaskItem` (checkbox → strike-through animation)
- `RewardUnlockModal` (confetti + card flip)
- `CommandPalette` (⌘K, via `cmdk`)

**shadcn setup notes:** dependencies are installed. Add a shadcn token block to `app/globals.css` mapping `--card`/`--primary`/`--border`/`--ring` etc. to the ember palette (ring = `#f15906`). Watch the **`Card.tsx` vs `card.tsx` casing collision** on Windows (see `01`) — prefer a custom `GlassCard` for dashboard surfaces.

## 7. Layout reference

```
┌────────────────────────────────────────────────┐
│ [frosted topbar: ⌘K search    ✦ 1,240 pts   ◉ ] │
├───────────┬────────────────────────────────────┤
│ frosted   │  content (scrolls)                  │
│ sidebar   │  ┌──────────────┐ ┌───────────────┐ │
│ ▸ Home ▓  │  │ Resume card  │ │ Next reward   │ │  ← glass cards, ember glow on hover
│ ▸ Courses │  └──────────────┘ └───────────────┘ │
│ ▸ Board   │  stat cards · this-semester scroller │
│ ▸ Goodies │                                      │
│ ▸ Tasks   │  (near-black #0A0A0A canvas)          │
│ ▸ Profile │                                      │
└───────────┴────────────────────────────────────┘
   ▓ = sliding ember pill (active item)
```

## 8. Accessibility

- Maintain contrast: don't drop body text below `text-white/70`.
- Decorative glows/gradients: `aria-hidden` + `pointer-events-none`.
- Keyboard-navigable everything (⌘K, focus rings in ember at low alpha).
- `role="status"` + `aria-live` on point/reward updates; `aria-pressed` on toggles.
- Honor `prefers-reduced-motion` (disable confetti/springs → instant states).
