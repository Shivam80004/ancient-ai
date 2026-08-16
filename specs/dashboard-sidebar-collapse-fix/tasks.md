# Implementation Plan: Dashboard Sidebar Collapse Fix

## Overview

Replace the imperative CSS-variable side-channel currently coupling `AppSidebar`'s collapsed state to `app/dashboard/layout.tsx`'s content padding with a single React context (`SidebarCollapseProvider`), introduce a `DashboardShell` client boundary to host that context, relocate the brand logo from the sidebar to `TopBar`, and wire everything through `layout.tsx` without altering its Server Component data-fetching responsibilities. No test framework currently exists in the repo, so the first task establishes one (Vitest + React Testing Library + fast-check) to support the property-based and unit/integration tests called for in `design.md`'s Testing Strategy.

## Tasks

- [x] 1. Set up frontend testing infrastructure
  - [x] 1.1 Add Vitest, React Testing Library, jsdom, and fast-check as dev dependencies; create `vitest.config.ts` (jsdom environment, path alias matching `@/*` from `tsconfig.json`) and a test setup file (e.g. `vitest.setup.ts`) importing `@testing-library/jest-dom`; add a `"test": "vitest run"` script to `package.json`
    - No existing test framework was found in the repo; this is a prerequisite for all testing sub-tasks below
    - _Requirements: supports Testing Strategy in design.md (Unit, Property-Based, Integration Testing Approach)_

- [x] 2. Implement the sidebar collapse context and hook
  - [x] 2.1 Create `components/dashboard/SidebarCollapseContext.tsx`
    - Define `SIDEBAR_COLLAPSE_KEY = "sidebar-collapsed"` and the `SidebarCollapseContextValue` type (`collapsed: boolean`, `setCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void`)
    - Implement `readStoredCollapsed()` returning `false` when `window`/`localStorage` is unavailable, otherwise `localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "1"`, wrapped in `try/catch` so read failures fall back to `false` instead of throwing
    - Implement `SidebarCollapseProvider({ children })` using `useSyncExternalStore` (`getSnapshot: readStoredCollapsed`, `getServerSnapshot: () => false`) plus local `useState`/`useEffect` re-sync, per the Algorithmic Pseudocode in design.md, so the server snapshot and first client snapshot never diverge
    - Implement `setCollapsed` to update state and persist to `localStorage` inside a `try/catch`, continuing with in-memory state on failure
    - Implement `useSidebarCollapse()` to read the context and throw `Error("useSidebarCollapse must be used within a SidebarCollapseProvider")` when called outside a provider
    - Do not reference `document.documentElement.style` anywhere in this file
    - _Requirements: 1.1, 1.5, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5, 9.1, 9.2, 9.3_

  - [ ]* 2.2 Write unit tests for `SidebarCollapseProvider`/`useSidebarCollapse`
    - Default `collapsed` is `false` when no stored preference exists
    - `setCollapsed(true)`/`setCollapsed(prev => !prev)` updates the value observed by a consumer component
    - Value is persisted to a mocked `localStorage` under `sidebar-collapsed` as `"1"`/`"0"`
    - `useSidebarCollapse()` throws the descriptive error when rendered without a wrapping provider
    - A mocked `localStorage.setItem`/`getItem` that throws does not crash the provider and toggling continues to work in memory
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.4, 4.5, 9.1, 9.2, 9.3_

- [x] 3. Implement `DashboardShell`
  - [x] 3.1 Create `components/dashboard/DashboardShell.tsx`
    - Define `DashboardShellProps` (`displayName`, `avatarUrl`, `level`, `title`, `isAdmin`, `points`, `children`) matching design.md's interface
    - Implement `DashboardShell` rendering the ambient glow wrapper, `SidebarCollapseProvider`, and an internal `ContentArea` (or equivalent) that reads `collapsed` via `useSidebarCollapse()` and computes `paddingClass` as `collapsed ? "lg:pl-20" : "lg:pl-64"`
    - Render `AppSidebar` (passing through `displayName`, `avatarUrl`, `level`, `title`, `isAdmin`) and a content wrapper `div` with the computed `paddingClass`, transition classes (`transition-[padding-left] duration-300 ease-in-out`), containing `TopBar` (passing through `displayName`, `avatarUrl`, `points`) and `<main>{children}</main>` with the existing `main` classes from the current `layout.tsx`
    - Mark the file with `"use client"` at the top
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3_

- [x] 4. Modify `AppSidebar` to consume shared context and relocate the logo
  - [ ] 4.1 Update `components/dashboard/AppSidebar.tsx`
    - Remove the local `collapsed` `useState`, the `useEffect` that reads `localStorage`/writes `document.documentElement.style.setProperty("--sidebar-w", ...)`, and replace with `const { collapsed, setCollapsed } = useSidebarCollapse();`
    - Remove the logo (`<img src="/logo-plain.png" ... />` inside `Link href="/"`) from the desktop-facing brand row; the desktop `<aside>` must no longer call `renderBrand()` for the logo
    - Add a standalone `renderCollapseToggle()` function rendering only the toggle button as its own row above `renderNav()`, preserving the existing `PanelLeftClose`/`PanelLeftOpen` icons, `aria-pressed`, `title`, and adding/preserving an `aria-label` describing the action ("Expand sidebar"/"Collapse sidebar")
    - Center the toggle row when `collapsed` is `true` (`justify-center`) and right-align it when `collapsed` is `false` (`justify-end`)
    - Keep the mobile bar's `renderBrand(false)` call and mobile drawer untouched, still rendering the logo
    - Keep `renderNav`, `renderFooter`, the active-pill (`layoutId="sidebar-pill"`), icon-only `title`/`aria-label` treatment, and the sign-out button unchanged
    - _Requirements: 1.2, 1.3, 1.5, 5.2, 5.3, 5.4, 6.1, 6.2, 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ]* 4.2 Write unit tests for the modified `AppSidebar`
    - Desktop `<aside>` renders the collapse toggle (not the logo) in both collapsed and expanded modes
    - Clicking the toggle calls `setCollapsed`
    - Toggle button has `aria-pressed`, `aria-label`, and `title` reflecting the current state, and is centered when collapsed / right-aligned when expanded
    - Navigation active-pill, icon-only labels (with `title`/`aria-label`), footer avatar/level display, and sign-out button still render as before
    - Mobile drawer (`renderBrand(false)`) still renders the logo, unaffected by `collapsed`
    - _Requirements: 5.2, 6.1, 6.2, 6.4, 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 5. Add the brand logo to `TopBar`
  - [x] 5.1 Update `components/dashboard/TopBar.tsx`
    - Add `<Link href="/">` wrapping the `/logo-plain.png` image as the leading element of the `<header>`, to the left of the existing search button
    - Preserve the existing `hidden ... lg:flex` desktop-only visibility and all other header content (search button, points pill, avatar) unchanged
    - _Requirements: 5.1, 5.3, 5.4, 6.3_

  - [ ]* 5.2 Write unit test for `TopBar` logo
    - `TopBar` renders an image with the logo source inside a link to `/`, positioned before the search button
    - _Requirements: 5.1_

- [ ] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Wire `DashboardShell` into `app/dashboard/layout.tsx`
  - [x] 7.1 Update `app/dashboard/layout.tsx`
    - Remove the manual `<AppSidebar .../>`, content-wrapper `<div className="... lg:pl-[var(--sidebar-w)] ...">`, `<TopBar .../>`, and `<main>` markup
    - Replace with a single `<DashboardShell displayName={...} avatarUrl={...} level={...} title={...} isAdmin={...} points={...}>{children}</DashboardShell>`
    - Keep all existing Server Component responsibilities unchanged: Supabase auth check, profile fetch, `onboarded` redirect, and the ambient glow div (or move the ambient glow into `DashboardShell` per design.md if that is where it was relocated in task 3.1 — keep the two files consistent with each other)
    - _Requirements: 1.1, 1.5, 3.1_

  - [ ]* 7.2 Write integration test for `layout.tsx` + `DashboardShell` composition
    - Rendering the composed tree does not throw and passes through `children` content unchanged
    - _Requirements: 1.1_

- [ ] 8. Remove the unused CSS custom property
  - [ ] 8.1 Update `app/globals.css`
    - Remove the `--sidebar-w: 16rem` custom property declaration from `:root`
    - Confirm (via search) no remaining references to `var(--sidebar-w)` exist anywhere in the codebase before removing it
    - _Requirements: 1.5_

- [ ] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 10. Write property-based test for sidebar/content synchronization
  - [ ]* 10.1 Write a `fast-check` property test covering Correctness Property 1
    - **Property 1: Sidebar width and content padding are never mutually inconsistent**
    - *For any* generated sequence of toggle operations applied to a rendered `DashboardShell`/`SidebarCollapseProvider` tree, at every render in the sequence `collapsed === true` iff the sidebar's width class is `w-20` and the content wrapper's padding class is `lg:pl-20`, and `collapsed === false` iff they are `w-64`/`lg:pl-64`, with a minimum of 100 iterations
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3**

- [ ]* 11. Write integration tests for synchronized updates and hydration safety
  - [ ]* 11.1 Write integration test for same-commit synchronized update
    - Simulate a toggle click on the composed `DashboardShell` tree and assert the sidebar and content wrapper DOM nodes update their classes within the same tick/commit, with no intermediate inconsistent state observable and no `act()` warnings
    - _Requirements: 1.2, 1.3, 1.4, 2.3_

  - [ ]* 11.2 Write integration test for hydration mismatch safety
    - Simulate SSR-then-hydrate for both a "no stored preference" `localStorage` state and a "previously collapsed" (`"1"`) `localStorage` state, asserting no React hydration mismatch console warnings/errors are produced in either case, and that the "previously collapsed" case flips to `collapsed=true` in at most one post-hydration commit
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 12. Final verification
  - [ ] 12.1 Run the project's build and typecheck, and confirm no unintended changes to mobile-only code paths
    - Run `npm run build` (and `tsc --noEmit` if not already covered by the build) and fix any type or build errors introduced by the above changes
    - Run the full test suite (`npm run test`) and confirm all tests pass
    - Diff/inspect `AppSidebar.tsx`'s `lg:hidden` mobile bar and drawer block to confirm it was not modified, satisfying the no-mobile-regression requirement
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4, 7.5_

## Notes

- Tasks marked with `*` are optional (test-related) and can be skipped for a faster MVP; core implementation tasks (1.1, 2.1, 3.1, 4.1, 5.1, 7.1, 8.1, 12.1) are not optional.
- Task 1.1 is a one-time infrastructure setup required before any `*` testing sub-task can run.
- Tasks 10 and 11 are grouped test-only tasks (all sub-tasks optional) since they depend on every implementation task above being complete; they are still ordered after the two checkpoints so implementation is validated incrementally before the broader property/integration suite is added.
- Checkpoints (6, 9) are natural pause points: after core provider/shell/sidebar/topbar work (6), and after layout wiring + CSS cleanup (9).

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1", "5.1"] },
    { "id": 1, "tasks": ["2.2", "3.1", "4.1", "5.2"] },
    { "id": 2, "tasks": ["4.2", "7.1"] },
    { "id": 3, "tasks": ["7.2", "8.1", "10.1", "11.1", "11.2"] },
    { "id": 4, "tasks": ["12.1"] }
  ]
}
```
