import type { Metadata } from "next";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { RoleToggle } from "./RoleToggle";

export const metadata: Metadata = { title: "Admin · Users" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    const admin = createSupabaseAdminClient();

    const { data: profiles } = await admin
        .from("profiles")
        .select("id, full_name, role, total_points, xp")
        .order("total_points", { ascending: false });

    const { data: doneEnroll } = await admin
        .from("enrollments")
        .select("user_id")
        .eq("status", "completed");
    const coursesByUser = new Map<string, number>();
    for (const e of doneEnroll ?? []) {
        if (e.user_id) coursesByUser.set(e.user_id, (coursesByUser.get(e.user_id) ?? 0) + 1);
    }

    // Emails from the auth admin API
    let emailById = new Map<string, string>();
    try {
        const { data } = await admin.auth.admin.listUsers();
        emailById = new Map(data.users.map((u) => [u.id, u.email ?? ""]));
    } catch {
        /* best-effort */
    }

    const rows = profiles ?? [];

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">Admin</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Users</h1>
                <p className="mt-1 text-sm text-white/50">{rows.length} learners.</p>
            </div>

            <GlassCard className="overflow-x-auto p-2">
                <table className="w-full min-w-[640px] text-sm">
                    <thead>
                        <tr className="text-left text-xs uppercase tracking-[0.15em] text-white/40">
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3 text-right">Points</th>
                            <th className="px-4 py-3 text-right">XP</th>
                            <th className="px-4 py-3 text-right">Courses done</th>
                            <th className="px-4 py-3 text-right">Role action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                        {rows.map((u) => (
                            <tr key={u.id} className="text-white/85">
                                <td className="px-4 py-3 font-medium">{u.full_name ?? "—"}</td>
                                <td className="px-4 py-3 text-white/50">{emailById.get(u.id) || "—"}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={
                                            u.role === "admin"
                                                ? "rounded-full bg-[#f15906]/15 px-2 py-0.5 text-xs font-semibold text-[#f15906]"
                                                : "text-xs text-white/50"
                                        }
                                    >
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right font-semibold">{(u.total_points ?? 0).toLocaleString()}</td>
                                <td className="px-4 py-3 text-right text-white/60">{(u.xp ?? 0).toLocaleString()}</td>
                                <td className="px-4 py-3 text-right text-white/60">{coursesByUser.get(u.id) ?? 0}</td>
                                <td className="px-4 py-3 text-right">
                                    <RoleToggle userId={u.id} role={u.role} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </GlassCard>
        </div>
    );
}
