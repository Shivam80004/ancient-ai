"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Home,
    GraduationCap,
    Trophy,
    Gift,
    ListChecks,
    User,
    Shield,
    LogOut,
    Menu,
    X,
    Clapperboard,
    BookOpen,
    MessageCircle,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { cn } from "@/lib/utils";
import { useSidebarCollapse } from "@/components/dashboard/SidebarCollapseContext";

const NAV = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/courses", label: "Courses", icon: GraduationCap },
    { href: "/dashboard/vibe", label: "Ancient Vibe", icon: Clapperboard },
    { href: "/dashboard/resources", label: "Free Resources", icon: BookOpen },
    { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/dashboard/goodies", label: "Goodies", icon: Gift },
    { href: "/dashboard/tasks", label: "Tasks", icon: ListChecks },
    { href: "/dashboard/profile", label: "Profile", icon: User },
];

type Props = {
    displayName: string;
    avatarUrl?: string | null;
    level: number;
    title: string;
    isAdmin?: boolean;
};

export function AppSidebar({ displayName, avatarUrl, level, title, isAdmin }: Props) {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [signingOut, setSigningOut] = useState(false);
    const [barHidden, setBarHidden] = useState(false);
    const { collapsed, setCollapsed } = useSidebarCollapse();

    // Mobile top bar: hide when scrolling down, reveal when scrolling up.
    useEffect(() => {
        let lastY = window.scrollY;
        const onScroll = () => {
            const y = window.scrollY;
            if (y < 8) setBarHidden(false);
            else if (y > lastY) setBarHidden(true); // scrolling down → hide
            else if (y < lastY) setBarHidden(false); // scrolling up → reveal
            lastY = y;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const isActive = (href: string) =>
        href === "/dashboard" ? pathname === href : pathname.startsWith(href);

    async function signOut() {
        setSigningOut(true);
        await getSupabaseBrowserClient().auth.signOut();
        router.replace("/login");
        router.refresh();
    }

    const items = isAdmin
        ? [...NAV, { href: "/admin", label: "Admin", icon: Shield }]
        : NAV;

    function renderBrand(showCollapseToggle: boolean) {
        return (
            <div
                className={cn(
                    "flex items-center gap-2 px-5 py-5",
                    showCollapseToggle && collapsed && "flex-col gap-3 px-3"
                )}
            >
                {/* <Link href="/" className="flex items-center gap-2">
                    <img src="/logo-plain.png" alt="Ancient AI University" className="h-9 w-auto shrink-0" />
                </Link> */}
            </div>
        );
    }

    function renderCollapseToggle() {
        return (
            <div className={cn("flex px-5 py-4", collapsed ? "justify-center px-3" : "justify-end")}>
                <button
                    onClick={() => setCollapsed((c) => !c)}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    aria-pressed={collapsed}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition hover:bg-white/[0.08] hover:text-white"
                >
                    {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
                </button>
            </div>
        );
    }

    function renderNav(collapsedMode: boolean) {
        return (
            <nav
                className={cn(
                    "flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2 transition-[padding] duration-300",
                    collapsedMode && "px-2"
                )}
            >
                {items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            title={collapsedMode ? item.label : undefined}
                            aria-label={item.label}
                            className={cn(
                                "relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                                collapsedMode && "justify-center px-0",
                                active ? "text-white" : "text-white/60 hover:text-white"
                            )}
                        >
                            {active && (
                                <motion.span
                                    layoutId="sidebar-pill"
                                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                                    className="absolute inset-0 rounded-2xl bg-gradient-to-bl to-orange-600 from-red-950  shadow-lg shadow-orange-900/30"
                                />
                            )}
                            <Icon className="relative z-10 size-[18px] shrink-0" />
                            {!collapsedMode && <span className="relative z-10 truncate">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>
        );
    }

    function renderFooter(collapsedMode: boolean) {
        return (
            <div className="border-t border-white/[0.08] p-3">
                <div
                    className={cn(
                        "flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3",
                        collapsedMode && "justify-center px-0"
                    )}
                >
                    {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarUrl} alt={displayName} className="size-9 shrink-0 rounded-full border border-[#f15906]/40 object-cover" />
                    ) : (
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-red-600 text-sm font-bold text-white">
                            {displayName.charAt(0).toUpperCase()}
                        </span>
                    )}
                    {!collapsedMode && (
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                            <p className="truncate text-xs text-white/45">Lvl {level} · {title}</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={signOut}
                    disabled={signingOut}
                    title={collapsedMode ? "Sign out" : undefined}
                    aria-label="Sign out"
                    className={cn(
                        "mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-60"
                    )}
                >
                    <LogOut className="size-4 shrink-0" />
                    {!collapsedMode && (signingOut ? "Signing out…" : "Sign out")}
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Desktop sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 top-[7vh] z-40 hidden flex-col border-r border-white/[0.08] bg-[#0A0A0A]/80 backdrop-blur-xl lg:flex",
                    "transition-[width] duration-300 ease-in-out",
                    collapsed ? "w-20" : "w-64"
                )}
            >
                {renderCollapseToggle()}
                {renderNav(collapsed)}
                {renderFooter(collapsed)}
            </aside>

            {/* Mobile top bar */}
            <div className={cn(
                "fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#0A0A0A]/80 px-4 backdrop-blur-xl transition-transform duration-300 lg:hidden",
                barHidden ? "-translate-y-full" : "translate-y-0"
            )}>
                <Link href="/" className="flex items-center">
                    <img src="/logo-plain.png" alt="Ancient AI University" className="h-8 w-auto" />
                </Link>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/vibe" className="flex size-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06] text-white">
                        <Clapperboard className="size-5" />
                    </Link>
                    <button
                        onClick={() => setOpen(true)}
                        aria-label="Open menu"
                        className="flex size-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06] text-white"
                    >
                        <Menu className="size-5" />
                    </button>
                </div>
            </div>

            {/* Mobile drawer — always fully expanded, unaffected by desktop collapse state */}
            {open && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
                    <aside className="absolute inset-y-0 right-0 flex w-72 flex-col border-r border-white/[0.08] bg-[#0A0A0A] shadow-2xl">
                        <div className="flex items-center justify-between pr-3">
                            {renderBrand(false)}
                            <button
                                onClick={() => setOpen(false)}
                                aria-label="Close menu"
                                className="flex size-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06] text-white"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                        {renderNav(false)}
                        {renderFooter(false)}
                    </aside>
                </div>
            )}
        </>
    );
}
