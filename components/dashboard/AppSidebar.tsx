"use client";

import { useState } from "react";
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
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { cn } from "@/lib/utils";

const NAV = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/courses", label: "Courses", icon: GraduationCap },
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

    const brand = (
        <Link href="/" className="flex items-center gap-2 px-5 py-5">
            <img src="/logo-plain.png" alt="Ancient AI University" className="h-9 w-auto" />
        </Link>
    );

    const nav = (
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
            {items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                            "relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                            active ? "text-white" : "text-white/60 hover:text-white"
                        )}
                    >
                        {active && (
                            <motion.span
                                layoutId="sidebar-pill"
                                transition={{ type: "spring", stiffness: 400, damping: 34 }}
                                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 shadow-lg shadow-orange-900/30"
                            />
                        )}
                        <Icon className="relative z-10 size-[18px] shrink-0" />
                        <span className="relative z-10">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );

    const footer = (
        <div className="border-t border-white/[0.08] p-3">
            <div className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3">
                {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt={displayName} className="size-9 rounded-full border border-[#f15906]/40 object-cover" />
                ) : (
                    <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-red-600 text-sm font-bold text-white">
                        {displayName.charAt(0).toUpperCase()}
                    </span>
                )}
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                    <p className="truncate text-xs text-white/45">Lvl {level} · {title}</p>
                </div>
            </div>
            <button
                onClick={signOut}
                disabled={signingOut}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-60"
            >
                <LogOut className="size-4" />
                {signingOut ? "Signing out…" : "Sign out"}
            </button>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/[0.08] bg-[#0A0A0A]/80 backdrop-blur-xl lg:flex">
                {brand}
                {nav}
                {footer}
            </aside>

            {/* Mobile top bar */}
            <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#0A0A0A]/80 px-4 backdrop-blur-xl lg:hidden">
                <Link href="/" className="flex items-center">
                    <img src="/logo-plain.png" alt="Ancient AI University" className="h-8 w-auto" />
                </Link>
                <button
                    onClick={() => setOpen(true)}
                    aria-label="Open menu"
                    className="flex size-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06] text-white"
                >
                    <Menu className="size-5" />
                </button>
            </div>

            {/* Mobile drawer */}
            {open && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
                    <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-white/[0.08] bg-[#0A0A0A] shadow-2xl">
                        <div className="flex items-center justify-between pr-3">
                            {brand}
                            <button
                                onClick={() => setOpen(false)}
                                aria-label="Close menu"
                                className="flex size-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06] text-white"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                        {nav}
                        {footer}
                    </aside>
                </div>
            )}
        </>
    );
}
