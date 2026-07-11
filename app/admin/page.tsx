import type { Metadata } from "next";
import Link from "next/link";
import { Users, GraduationCap, Sparkles, Gift, ListChecks } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { GlassCard } from "@/components/dashboard/GlassCard";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminOverview() {
    const admin = createSupabaseAdminClient();

    const [users, courses, pendingClaims, pendingTasks, ledger] = await Promise.all([
        admin.from("profiles").select("id", { count: "exact", head: true }),
        admin.from("courses").select("id", { count: "exact", head: true }),
        admin.from("gift_claims").select("id", { count: "exact", head: true }).eq("status", "requested"),
        admin.from("task_assignments").select("id", { count: "exact", head: true }).eq("status", "submitted"),
        admin.from("point_ledger").select("amount"),
    ]);

    const totalPointsIssued = (ledger.data ?? [])
        .filter((r) => r.amount > 0)
        .reduce((s, r) => s + r.amount, 0);

    const kpis = [
        { label: "Users", value: users.count ?? 0, icon: Users },
        { label: "Courses", value: courses.count ?? 0, icon: GraduationCap },
        { label: "Points issued", value: totalPointsIssued, icon: Sparkles },
        { label: "Pending claims", value: pendingClaims.count ?? 0, icon: Gift, href: "/admin/claims" },
        { label: "Tasks to approve", value: pendingTasks.count ?? 0, icon: ListChecks, href: "/admin/tasks" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">Admin</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Overview</h1>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                {kpis.map((k) => {
                    const Icon = k.icon;
                    const card = (
                        <GlassCard hover className="p-5">
                            <Icon className="size-5 text-[#f15906]" />
                            <p className="mt-3 text-3xl font-semibold text-white">{k.value.toLocaleString()}</p>
                            <p className="text-xs uppercase tracking-[0.15em] text-white/40">{k.label}</p>
                        </GlassCard>
                    );
                    return k.href ? (
                        <Link key={k.label} href={k.href}>
                            {card}
                        </Link>
                    ) : (
                        <div key={k.label}>{card}</div>
                    );
                })}
            </div>

            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">Quick actions</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                    {[
                        { href: "/admin/courses", label: "Manage curriculum" },
                        { href: "/admin/rules", label: "Reward rules" },
                        { href: "/admin/claims", label: "Resolve claims" },
                        { href: "/admin/tasks", label: "Approve tasks" },
                        { href: "/admin/users", label: "View users" },
                    ].map((a) => (
                        <Link
                            key={a.href}
                            href={a.href}
                            className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.12]"
                        >
                            {a.label}
                        </Link>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}
