"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, GraduationCap, Trophy, ListChecks, Gift, Users, ArrowLeft, Clapperboard } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/courses", label: "Curriculum", icon: GraduationCap },
    { href: "/admin/vibe", label: "Ancient Vibe", icon: Clapperboard },
    { href: "/admin/rules", label: "Reward Rules", icon: Trophy },
    { href: "/admin/tasks", label: "Tasks", icon: ListChecks },
    { href: "/admin/claims", label: "Claims", icon: Gift },
    { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const active = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

    return (
        <div className="relative min-h-screen w-full bg-[#0A0A0A] text-white">
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-white/[0.08] bg-[#0A0A0A]/80 backdrop-blur-xl lg:flex">
                <div className="flex items-center gap-2 px-5 py-5">
                    <img src="/logo-plain.png" alt="Admin" className="h-8 w-auto" />
                    <span className="rounded-full bg-[#f15906]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#f15906]">
                        Admin
                    </span>
                </div>
                <nav className="flex-1 space-y-1 px-3 py-2">
                    {NAV.map((n) => {
                        const Icon = n.icon;
                        return (
                            <Link
                                key={n.href}
                                href={n.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                                    active(n.href)
                                        ? "bg-gradient-to-r from-orange-600 to-red-600 text-white"
                                        : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                                )}
                            >
                                <Icon className="size-[18px]" />
                                {n.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="border-t border-white/[0.08] p-3">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/[0.06] hover:text-white"
                    >
                        <ArrowLeft className="size-4" /> Back to app
                    </Link>
                </div>
            </aside>

            {/* Mobile top nav */}
            <div className="sticky top-0 z-30 flex gap-1 overflow-x-auto border-b border-white/[0.08] bg-[#0A0A0A]/80 px-3 py-2 backdrop-blur-xl lg:hidden">
                {NAV.map((n) => (
                    <Link
                        key={n.href}
                        href={n.href}
                        className={cn(
                            "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium",
                            active(n.href) ? "bg-gradient-to-r from-orange-600 to-red-600 text-white" : "text-white/60"
                        )}
                    >
                        {n.label}
                    </Link>
                ))}
            </div>

            <div className="lg:pl-60">
                <main className="mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-8">{children}</main>
            </div>
        </div>
    );
}
