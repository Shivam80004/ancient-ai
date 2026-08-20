"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

/** Key used to persist the user's collapse preference across sessions. */
export const SIDEBAR_COLLAPSE_KEY = "sidebar-collapsed";

/** Shape of the context value shared by AppSidebar and the content wrapper. */
type SidebarCollapseContextValue = {
    collapsed: boolean;
    setCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
};

const SidebarCollapseContext = createContext<SidebarCollapseContextValue | null>(null);

/**
 * Reads the persisted collapse preference from localStorage.
 * Safe to call in both server and client environments — returns `false`
 * whenever `window`/`localStorage` is unavailable, and never throws.
 */
function readStoredCollapsed(): boolean {
    if (typeof window === "undefined") return false;
    try {
        return window.localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "1";
    } catch {
        return false;
    }
}

// noop unsubscribe — the preference doesn't need cross-tab sync in this feature's scope.
function subscribe(_callback: () => void) {
    return () => {};
}

function getServerSnapshot() {
    return false;
}

export function SidebarCollapseProvider({ children }: { children: ReactNode }) {
    const storedCollapsed = useSyncExternalStore(subscribe, readStoredCollapsed, getServerSnapshot);
    const [collapsed, setCollapsedState] = useState(storedCollapsed);

    // Re-sync local state if the externally-derived snapshot changes
    // (covers the post-hydration flip when a stored preference exists).
    useEffect(() => {
        setCollapsedState(storedCollapsed);
    }, [storedCollapsed]);

    function setCollapsed(value: boolean | ((prev: boolean) => boolean)) {
        setCollapsedState((prev) => {
            const resolved = typeof value === "function" ? (value as (prev: boolean) => boolean)(prev) : value;
            try {
                window.localStorage.setItem(SIDEBAR_COLLAPSE_KEY, resolved ? "1" : "0");
            } catch {
                // Continue with in-memory state on failure.
            }
            return resolved;
        });
    }

    return (
        <SidebarCollapseContext.Provider value={{ collapsed, setCollapsed }}>
            {children}
        </SidebarCollapseContext.Provider>
    );
}

export function useSidebarCollapse(): SidebarCollapseContextValue {
    const context = useContext(SidebarCollapseContext);
    if (!context) {
        throw new Error("useSidebarCollapse must be used within a SidebarCollapseProvider");
    }
    return context;
}
