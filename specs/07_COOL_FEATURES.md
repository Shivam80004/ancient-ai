# 07 — Cool / Differentiating Features

Ideas to make this feel less like an LMS and more like a *product people want to open daily*. Each has a rough effort tag: 🟢 easy · 🟡 medium · 🔴 ambitious.

## Interaction & delight

- 🟢 **⌘K Command Palette** (`cmdk`) — Raycast-style. Jump to any course, task, or page; "Resume last lesson"; "Show my rank". Instantly reads as a Mac-native power tool.
- 🟢 **Reward unlock moments** — full-screen `canvas-confetti` + a collectible "card flip" reveal when a benchmark is hit. Make earning *feel* earned.
- 🟢 **Animated progress rings & count-ups** everywhere points/progress appear.
- 🟡 **Focus / Study Mode** — a distraction-free lesson view with an optional Pomodoro timer; completing a focus session grants a small streak bonus.

## Gamification depth

- 🟡 **Streaks & daily quests** — "Learn today to keep your 5-day streak." A tiny daily task that feeds `streak_days` rules (backed by the `streaks` table). This alone drives retention hard.
- 🟡 **XP levels + titles** — lifetime `profiles.xp` maps to levels ("Novice → Adept → Scholar → Sage of Ancient AI"). Level-ups are their own celebration, separate from spendable `total_points`. (XP persists across seasons; points can reset.)
- 🟡 **Badges / achievements wall** — "Night Owl", "First Semester Cleared", "Perfect Quiz". Visual collectible glass grid on the profile.
- 🔴 **Seasons as leaderboard resets** — each season (`settings.season_start`), ranking points reset but XP/level persists. Fresh competition + recurring goodie drops.
- 🟡 **Cohorts / houses** — Hogwarts-style. Assign users to houses; a house leaderboard adds team stakes on top of individual ranking.

## Social & motivation

- 🟡 **Peer nudges / kudos** — react to someone's achievement on an activity feed.
- 🔴 **Study buddies / referrals** — invite a friend, both get bonus points when they complete a course.
- 🟢 **Public shareable certificate + profile card** — a clean OG-image card ("I'm a Semester 1 Scholar at Ancient AI University") to post on LinkedIn/X. Free marketing.

## Learning quality

- 🟡 **AI course companion (the true differentiator)** — an in-lesson chat that answers questions about the current lesson, quizzes the user, and summarizes. **Call the Anthropic Claude API from a server route** (`app/api/ai-companion/route.ts`) so `ANTHROPIC_API_KEY` is never exposed to the browser; stream the response. Ground it in the current lesson's `body`/transcript (pass as system context). Use the latest Claude model. This fits the "Ancient AI" brand perfectly and is what sets you apart from generic LMS tools.
- 🟡 **Adaptive next-step recommendation** — "Because you finished X, try Y" based on difficulty + prerequisites.
- 🟢 **Quiz with instant feedback + retry-for-mastery** rather than pass/fail.

## Polish that punches above its weight

- 🟢 **A single, flawless dark theme** — no theme toggle to maintain; instead invest that effort in getting the near-black + ember glass *perfect* (depth, glow, motion). Premium > configurable.
- 🟢 **Keyboard-navigable everything** (Mac users expect it).
- 🟢 **Empty states with personality** — a friendly illustration + one clear CTA instead of blank tables.
- 🟡 **Realtime** — Supabase Realtime so the leaderboard and points pill update live when the user (or others) earn points. Feels alive.

## Top 5 to ship first for maximum "wow-to-effort"

1. ⌘K command palette (🟢)
2. Reward-unlock confetti + card reveal (🟢)
3. Streaks + daily quest (🟡)
4. Near-black glass shell with spring animations (🟢, mostly CSS + Framer Motion)
5. AI course companion via Claude (🟡) — the true differentiator vs generic LMS tools
