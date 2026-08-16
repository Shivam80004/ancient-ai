"use client";

import type { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { SidebarCollapseProvider, useSidebarCollapse } from "./SidebarCollapseContext";
import { cn } from "@/lib/utils";

export type DashboardShellProps = {
    displayName: string;
    avatarUrl?: string | null;
    level: number;
    title: string;
    isAdmin?: boolean;
    points: number;
    children: ReactNode;
};

type ContentAreaProps = Omit<DashboardShellProps, "children"> & { children: ReactNode };

/**
 * Renders the sidebar + content wrapper. Must live inside `SidebarCollapseProvider`
 * since it reads `collapsed` via `useSidebarCollapse()` to compute the content offset.
 */
function ContentArea({ displayName, avatarUrl, level, title, isAdmin, points, children }: ContentAreaProps) {
    const { collapsed } = useSidebarCollapse();

    const paddingClass = collapsed ? "lg:pl-20" : "lg:pl-64";

    return (
        <div>
            <TopBar displayName={displayName} avatarUrl={avatarUrl} points={points} />
            <div className="mt-[8vh]">
            <AppSidebar
                displayName={displayName}
                avatarUrl={avatarUrl}
                level={level}
                title={title}
                isAdmin={isAdmin}
            />

            <div className={cn("relative z-10 transition-[padding-left] duration-300 ease-in-out", paddingClass)}>
                <main className="mx-auto max-w-8xl px-5 pb-24 pt-20 sm:px-6 lg:px-8 lg:pt-6">
                    {children}
                </main>
            </div>
            </div>
        </div>
    );
}

export function DashboardShell({ displayName, avatarUrl, level, title, isAdmin, points, children }: DashboardShellProps) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0A] text-white">
            {/* Ambient ember glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,_rgba(241,89,6,0.10),_transparent_70%)] blur-3xl"
            />

            <SidebarCollapseProvider>
                <ContentArea
                    displayName={displayName}
                    avatarUrl={avatarUrl}
                    level={level}
                    title={title}
                    isAdmin={isAdmin}
                    points={points}
                >
                    {children}
                </ContentArea>
            </SidebarCollapseProvider>
        </div>
    );
}
