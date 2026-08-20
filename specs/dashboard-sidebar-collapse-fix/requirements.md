# Requirements Document

## Introduction

This document specifies the requirements for fixing the dashboard sidebar collapse/expand feature, derived from the approved `design.md` in this directory. The current implementation couples the collapsible desktop sidebar (`AppSidebar.tsx`) and the main content offset (`app/dashboard/layout.tsx`) through an imperative CSS custom property side-channel, which does not reliably keep the two in sync. This feature replaces that side-channel with a single React context-based source of truth (`SidebarCollapseProvider`), relocates the brand logo from the collapsible sidebar to the always-visible `TopBar`, and preserves all existing sidebar behavior and mobile behavior unchanged.

## Glossary

- **Dashboard_Shell**: The client component boundary (`DashboardShell`) that wraps the sidebar, content wrapper, and `TopBar`, and receives server-fetched props and `children` from `app/dashboard/layout.tsx`.
- **Sidebar_Collapse_Provider**: The React context provider (`SidebarCollapseProvider`) that owns the single `collapsed` boolean state and exposes it via the `useSidebarCollapse()` hook.
- **App_Sidebar**: The desktop collapsible sidebar component (`AppSidebar.tsx`), rendered as a `<aside>` on large viewports.
- **Content_Wrapper**: The `div` inside `Dashboard_Shell`/`ContentArea` whose left-padding class is derived from the `collapsed` state and which contains `TopBar` and `<main>`.
- **Top_Bar**: The desktop-only header component (`TopBar.tsx`), visible via `hidden ... lg:flex`.
- **Mobile_Bar**: The `lg:hidden` fixed top bar rendered by `App_Sidebar` for small viewports, along with its associated mobile drawer.
- **Collapsed_State**: The boolean value (`true` = collapsed/icon-only, `false` = expanded) shared by `App_Sidebar` and `Content_Wrapper` via `Sidebar_Collapse_Provider`.
- **Collapse_Toggle_Button**: The button rendered by `App_Sidebar` (via `renderCollapseToggle()`) that calls `setCollapsed` to flip `Collapsed_State`.
- **Stored_Preference**: The value persisted under the `localStorage` key `sidebar-collapsed` (`"0"` or `"1"`).

## Requirements

### Requirement 1: Sidebar and Content Offset State Consistency

**User Story:** As a dashboard user, I want the main content area to resize in lockstep with the sidebar whenever I collapse or expand it, so that the layout never looks broken or misaligned.

#### Acceptance Criteria

1. THE Sidebar_Collapse_Provider SHALL expose a single `collapsed` boolean value consumed by both App_Sidebar and Content_Wrapper.
2. WHEN Collapsed_State changes to `true`, THE App_Sidebar SHALL render with width class `w-20` AND THE Content_Wrapper SHALL render with padding class `lg:pl-20` in the same render commit.
3. WHEN Collapsed_State changes to `false`, THE App_Sidebar SHALL render with width class `w-64` AND THE Content_Wrapper SHALL render with padding class `lg:pl-64` in the same render commit.
4. FOR ALL sequences of toggle operations applied via the Collapse_Toggle_Button, THE App_Sidebar's width class and THE Content_Wrapper's padding class SHALL never simultaneously reflect different values of Collapsed_State.
5. THE Dashboard_Shell SHALL NOT use `document.documentElement.style.setProperty` or any CSS custom property to communicate Collapsed_State between App_Sidebar and Content_Wrapper.

### Requirement 2: Synchronized Transition Animation

**User Story:** As a dashboard user, I want the sidebar and content area to animate together when I toggle the collapse state, so that the transition feels smooth and intentional rather than jarring.

#### Acceptance Criteria

1. WHEN Collapsed_State changes, THE App_Sidebar SHALL animate its width change using a CSS transition with a duration of 300ms and an ease-in-out timing function.
2. WHEN Collapsed_State changes, THE Content_Wrapper SHALL animate its left-padding change using a CSS transition with a duration of 300ms and an ease-in-out timing function.
3. WHEN Collapsed_State changes, THE App_Sidebar's width transition AND THE Content_Wrapper's padding transition SHALL begin on the same animation frame.

### Requirement 3: Hydration Consistency

**User Story:** As a dashboard user with no previously stored sidebar preference, I want the dashboard to render without any visible layout flash on first load, so that the page feels stable and polished.

#### Acceptance Criteria

1. WHEN the Dashboard_Shell is server-rendered, THE Sidebar_Collapse_Provider SHALL use `false` (expanded) as the server snapshot for Collapsed_State.
2. WHILE no Stored_Preference exists in `localStorage`, THE Sidebar_Collapse_Provider SHALL keep Collapsed_State equal to the server-rendered value (`false`) through and after hydration, producing zero visible layout flash.
3. IF a Stored_Preference of `"1"` exists in `localStorage`, THEN THE Sidebar_Collapse_Provider SHALL update Collapsed_State to `true` in a render commit after hydration completes, and SHALL NOT flip Collapsed_State more than once during the initial load sequence.
4. THE Sidebar_Collapse_Provider SHALL NOT produce a React hydration mismatch warning for the case where no Stored_Preference exists.

### Requirement 4: Collapse Preference Persistence

**User Story:** As a dashboard user, I want my sidebar collapse choice to be remembered across page reloads and while navigating between dashboard pages, so that I don't have to re-collapse it every time.

#### Acceptance Criteria

1. WHEN a user activates the Collapse_Toggle_Button, THE Sidebar_Collapse_Provider SHALL write the resulting Collapsed_State to `localStorage` under the key `sidebar-collapsed` as `"1"` (collapsed) or `"0"` (expanded).
2. WHEN the dashboard is reloaded AND a Stored_Preference exists, THE Sidebar_Collapse_Provider SHALL initialize Collapsed_State from that Stored_Preference after hydration.
3. WHILE a user navigates between pages within `app/dashboard` via client-side navigation, THE Sidebar_Collapse_Provider SHALL NOT remount, AND Collapsed_State SHALL remain unchanged across that navigation.
4. IF a read from or write to `localStorage` throws an exception, THEN THE Sidebar_Collapse_Provider SHALL catch the exception AND SHALL continue operating using in-memory Collapsed_State for the remainder of the session without crashing the Dashboard_Shell.
5. IF `localStorage` is unavailable, THEN THE Sidebar_Collapse_Provider SHALL default Collapsed_State to `false` and SHALL allow toggling to continue functioning for the current session.

### Requirement 5: Brand Logo Relocation

**User Story:** As a dashboard user on desktop, I want the brand logo to remain visible regardless of sidebar collapse state, so that the brand identity isn't lost when I collapse the sidebar.

#### Acceptance Criteria

1. THE Top_Bar SHALL render the brand logo, linking to `/`, as the leading element of its header content.
2. THE App_Sidebar's desktop `<aside>` SHALL NOT render the brand logo in either collapsed or expanded state.
3. WHEN Collapsed_State is `true`, THE Top_Bar SHALL continue to display the brand logo unchanged.
4. WHEN Collapsed_State is `false`, THE Top_Bar SHALL continue to display the brand logo unchanged.

### Requirement 6: Mobile Behavior Unchanged

**User Story:** As a dashboard user on a mobile viewport, I want the mobile navigation experience to remain exactly as it was, so that this desktop-focused fix does not introduce any mobile regression.

#### Acceptance Criteria

1. THE Mobile_Bar SHALL continue to render its own brand logo, independent of Top_Bar and independent of Collapsed_State.
2. THE Mobile_Bar's mobile drawer SHALL render in a fully-expanded state, unaffected by Collapsed_State.
3. THE Top_Bar SHALL remain hidden on viewports below the `lg` breakpoint.
4. WHERE the viewport is below the `lg` breakpoint, THE Dashboard_Shell SHALL NOT alter any existing Mobile_Bar markup, styling, or behavior as a result of this feature.

### Requirement 7: No Regression to Existing Sidebar Behavior

**User Story:** As a dashboard user, I want all existing sidebar features (navigation highlighting, icon-only labels, footer profile display, sign-out) to keep working exactly as before, so that this refactor doesn't break functionality I already rely on.

#### Acceptance Criteria

1. THE App_Sidebar SHALL preserve the active navigation item's pill animation (`layoutId="sidebar-pill"`) unchanged.
2. WHEN Collapsed_State is `true`, THE App_Sidebar SHALL render navigation items icon-only, each with a `title` attribute and an `aria-label` attribute describing the item.
3. THE App_Sidebar SHALL preserve the footer's avatar and level display behavior unchanged in both collapsed and expanded states.
4. THE App_Sidebar SHALL preserve the sign-out button's presence and behavior unchanged.
5. THE Mobile_Bar's drawer SHALL continue to render fully expanded regardless of the desktop Collapsed_State value.

### Requirement 8: Collapse Toggle Button Accessibility and Positioning

**User Story:** As a dashboard user relying on assistive technology, I want the collapse toggle button to remain clearly labeled and usable after the logo is removed from the sidebar, so that I can still operate the sidebar collapse feature.

#### Acceptance Criteria

1. THE App_Sidebar SHALL render the Collapse_Toggle_Button as its own standalone element, independent of any brand/logo row.
2. THE Collapse_Toggle_Button SHALL include an `aria-pressed` attribute reflecting the current Collapsed_State.
3. THE Collapse_Toggle_Button SHALL include an `aria-label` attribute describing the action it performs ("Expand sidebar" or "Collapse sidebar") based on the current Collapsed_State.
4. THE Collapse_Toggle_Button SHALL include a `title` attribute matching its `aria-label`.
5. WHEN Collapsed_State is `true`, THE Collapse_Toggle_Button SHALL be horizontally centered within its row.
6. WHEN Collapsed_State is `false`, THE Collapse_Toggle_Button SHALL be right-aligned within its row.

### Requirement 9: Error Handling

**User Story:** As a developer maintaining this codebase, I want misuse of the sidebar collapse context and storage failures to be handled predictably, so that bugs are caught early and users never see a crashed dashboard.

#### Acceptance Criteria

1. IF `useSidebarCollapse()` is called from a component not rendered within a Sidebar_Collapse_Provider, THEN THE useSidebarCollapse hook SHALL throw an error with a descriptive message identifying the missing provider.
2. IF an exception is thrown while reading from or writing to `localStorage` during a Collapsed_State change, THEN THE Sidebar_Collapse_Provider SHALL catch the exception AND SHALL NOT allow it to propagate and crash the Dashboard_Shell.
3. IF `localStorage` access fails, THEN THE Sidebar_Collapse_Provider SHALL continue to allow the Collapse_Toggle_Button to toggle Collapsed_State in memory for the remainder of the session.
