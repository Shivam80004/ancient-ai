import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth/guard";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { RoleToggle } from "../RoleToggle";

export const metadata: Metadata = { title: "Admin · User" };
export const dynamic = "force-dynamic";

const XP_PER_LEVEL = 1000;

export default async function AdminUserDetail({ params }: { params: Promise<{ userId: string }> }) {
    await requireAdmin();
    const { userId } = await params;

    // Admin's own session client can read any row (RLS admin policies); untyped so it
    // sees the onboarding columns without a types regen.
    const supabase = await createSupabaseServerClient();
    const { data: p } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    if (!p) notFound();

    const admin = createSupabaseAdminClient();
    let email = "—";
    try {
        const { data } = await admin.auth.admin.getUserById(userId);
        email = data.user?.email ?? "—";
    } catch { /* best-effort */ }

    const { data: enrollments } = await supabase
        .from("enrollments")
        .select("status, course:courses(title)")
        .eq("user_id", userId);
    const coursesDone = (enrollments ?? []).filter((e) => e.status === "completed").length;

    const { data: ledger } = await supabase
        .from("point_ledger")
        .select("id, amount, reason, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(15);

    const interests: string[] = Array.isArray(p.interests) ? p.interests : [];
    const level = Math.floor((p.xp ?? 0) / XP_PER_LEVEL) + 1;

    const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
        <div className="flex items-start justify-between gap-6 border-b border-white/[0.06] py-2.5 last:border-0">
            <dt className="text-sm text-white/45">{label}</dt>
            <dd className="text-right text-sm text-white/85">{value || <span className="text-white/30">—</span>}</dd>
        </div>
    );

    return (
        <div className="space-y-6">
            <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-white/50 transition hover:text-white">
                <ArrowLeft className="size-4" /> All users
            </Link>

            {/* Header */}
            <GlassCard className="flex flex-wrap items-center justify-between gap-4 p-6">
                <div className="flex items-center gap-4">
                    {p.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.avatar_url} alt="" className="size-16 rounded-full border border-[#f15906]/40 object-cover" />
                    ) : (
                        <span className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-red-600 text-2xl font-bold text-white">
                            {(p.full_name ?? email).charAt(0).toUpperCase()}
                        </span>
                    )}
                    <div>
                        <h1 className="text-2xl font-semibold text-white">{p.full_name ?? "Learner"}</h1>
                        <p className="text-sm text-white/50">{email}</p>
                        <p className="mt-0.5 text-xs text-white/40">
                            Level {level} · {(p.total_points ?? 0).toLocaleString()} pts · {coursesDone} courses done
                        </p>
                    </div>
                </div>
                <RoleToggle userId={p.id} role={p.role} />
            </GlassCard>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Onboarding / profile */}
                <GlassCard className="p-6">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/40">Profile & interests</h2>
                    <dl>
                        <Row label="Occupation" value={p.occupation} />
                        <Row label="Detail" value={p.occupation_detail} />
                        <Row label="Organization" value={p.organization} />
                        <Row label="Domain" value={p.domain} />
                        <Row label="Experience" value={p.experience_level} />
                        <Row label="Onboarded" value={p.onboarded ? "Yes" : "No"} />
                    </dl>
                    <div className="mt-4">
                        <p className="mb-2 text-xs text-white/45">Interests</p>
                        {interests.length ? (
                            <div className="flex flex-wrap gap-2">
                                {interests.map((i) => (
                                    <span key={i} className="rounded-full border border-[#f15906]/25 bg-[#f15906]/10 px-3 py-1 text-xs text-[#f15906]">{i}</span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-white/30">None yet</p>
                        )}
                    </div>
                    {p.goals && (
                        <div className="mt-4">
                            <p className="mb-1 text-xs text-white/45">Goals</p>
                            <p className="text-sm text-white/80">{p.goals}</p>
                        </div>
                    )}
                </GlassCard>

                {/* Points history */}
                <GlassCard className="p-6">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/40">Points history</h2>
                    {ledger && ledger.length ? (
                        <ul className="space-y-2">
                            {ledger.map((l) => (
                                <li key={l.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 text-sm">
                                    <span className="capitalize text-white/80">{l.reason.replace(/_/g, " ")}</span>
                                    <span className={l.amount >= 0 ? "font-semibold text-[#f15906]" : "font-semibold text-white/50"}>
                                        {l.amount >= 0 ? "+" : ""}{l.amount}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-white/40">No points activity yet.</p>
                    )}
                </GlassCard>
            </div>
        </div>
    );
}
