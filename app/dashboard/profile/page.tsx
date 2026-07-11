import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Award, ScrollText, Gift, Sparkles, Trophy, Flame } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { ShippingForm } from "./ShippingForm";

export const metadata: Metadata = { title: "Profile" };

const XP_PER_LEVEL = 1000;
function titleFor(level: number) {
    if (level >= 10) return "Sage";
    if (level >= 6) return "Scholar";
    if (level >= 3) return "Adept";
    return "Novice";
}

export default async function ProfilePage() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    const name = (profile?.full_name as string | undefined) ?? user.email?.split("@")[0] ?? "Seeker";
    const points = (profile?.total_points as number | undefined) ?? 0;
    const xp = (profile?.xp as number | undefined) ?? 0;
    const level = Math.floor(xp / XP_PER_LEVEL) + 1;
    const levelPct = Math.round(((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100);
    const joined = profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "—";

    const { data: lb } = await supabase.rpc("get_leaderboard");
    const rank = (Array.isArray(lb) ? lb.find((r: { id: string }) => r.id === user.id) : null)?.rank ?? null;

    const { data: earned } = await supabase
        .from("earned_rewards")
        .select("id, reward_kind, reward_rules(name)")
        .eq("user_id", user.id);

    const { data: ledger } = await supabase
        .from("point_ledger")
        .select("id, amount, reason, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

    const { data: certificates } = await supabase
        .from("certificates")
        .select("id, title, pdf_url, issued_at")
        .eq("user_id", user.id);

    const kindIcon = (k: string | null) => (k === "certificate" ? ScrollText : k === "gift" ? Gift : Award);

    return (
        <div className="space-y-6">
            {/* Header */}
            <GlassCard className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-5">
                    {profile?.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={profile.avatar_url} alt={name} className="size-20 rounded-full border-2 border-[#f15906]/40 object-cover" />
                    ) : (
                        <span className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-red-600 text-3xl font-bold text-white">
                            {name.charAt(0).toUpperCase()}
                        </span>
                    )}
                    <div>
                        <h1 className="text-3xl font-semibold text-white">{name}</h1>
                        <p className="text-sm text-white/50">{user.email}</p>
                        <p className="mt-1 text-xs text-white/40">Joined {joined} · {titleFor(level)}</p>
                    </div>
                </div>
                <ProgressRing value={levelPct} size={104} stroke={10}>
                    <div className="text-center">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Level</p>
                        <p className="text-2xl font-bold text-white">{level}</p>
                    </div>
                </ProgressRing>
            </GlassCard>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Points", value: points.toLocaleString(), icon: Sparkles },
                    { label: "XP", value: xp.toLocaleString(), icon: Flame },
                    { label: "Rank", value: rank ? `#${rank}` : "—", icon: Trophy },
                ].map((s) => {
                    const Icon = s.icon;
                    return (
                        <GlassCard key={s.label} className="p-5 text-center">
                            <Icon className="mx-auto size-5 text-[#f15906]" />
                            <p className="mt-2 text-2xl font-semibold text-white">{s.value}</p>
                            <p className="text-xs uppercase tracking-[0.15em] text-white/40">{s.label}</p>
                        </GlassCard>
                    );
                })}
            </div>

            {/* Achievements */}
            <GlassCard className="p-8">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">Achievements</h2>
                {earned && earned.length > 0 ? (
                    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {earned.map((e) => {
                            const Icon = kindIcon(e.reward_kind);
                            return (
                                <div key={e.id} className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 text-center">
                                    <span className="flex size-11 items-center justify-center rounded-2xl bg-[#f15906]/12 text-[#f15906]">
                                        <Icon className="size-5" />
                                    </span>
                                    <span className="text-xs font-medium text-white/80">
                                        {(e.reward_rules as unknown as { name: string } | null)?.name ?? "Reward"}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="mt-4 text-sm text-white/50">No achievements yet — complete courses and hit milestones to earn badges.</p>
                )}
            </GlassCard>

            {/* Certificates */}
            <GlassCard className="p-8">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">Certificates</h2>
                {certificates && certificates.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                        {certificates.map((c) => (
                            <li key={c.id} className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
                                <span className="text-sm text-white/80">{c.title}</span>
                                {c.pdf_url ? (
                                    <a href={c.pdf_url} className="text-sm font-semibold text-[#f15906] hover:underline">Download</a>
                                ) : (
                                    <span className="text-xs text-white/30">Generating…</span>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-4 text-sm text-white/50">No certificates yet.</p>
                )}
            </GlassCard>

            {/* Points history */}
            <GlassCard className="p-8">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">Points history</h2>
                {ledger && ledger.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                        {ledger.map((l) => (
                            <li key={l.id} className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
                                <div>
                                    <p className="text-sm capitalize text-white/80">{l.reason.replace(/_/g, " ")}</p>
                                    <p className="text-xs text-white/35">
                                        {l.created_at ? new Date(l.created_at).toLocaleString() : ""}
                                    </p>
                                </div>
                                <span className={l.amount >= 0 ? "text-sm font-semibold text-[#f15906]" : "text-sm font-semibold text-white/50"}>
                                    {l.amount >= 0 ? "+" : ""}
                                    {l.amount}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-4 text-sm text-white/50">No points yet.</p>
                )}
            </GlassCard>

            {/* Shipping address */}
            <GlassCard className="p-8">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">Shipping address</h2>
                <p className="mb-4 mt-1 text-xs text-white/40">Used to pre-fill your gift claims.</p>
                <ShippingForm initial={(profile?.shipping_info as Record<string, string>) ?? {}} />
            </GlassCard>
        </div>
    );
}
