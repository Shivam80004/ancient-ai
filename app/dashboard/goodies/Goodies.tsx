"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Award, Gift, ScrollText, Sparkles, Loader2, Check } from "lucide-react";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { cn } from "@/lib/utils";

export type UnlockedVM = { id: string; name: string; kind: string | null };
export type ShopVM = { id: string; title: string; description: string | null; cost: number; stock: number | null };
export type ClaimVM = { id: string; title: string; status: string };

const STEPS = ["requested", "approved", "shipped"];

export function Goodies({
    balance,
    unlocked,
    shop,
    claims,
}: {
    balance: number;
    unlocked: UnlockedVM[];
    shop: ShopVM[];
    claims: ClaimVM[];
}) {
    const router = useRouter();
    const [tab, setTab] = useState<"unlocked" | "shop">("unlocked");
    const [busy, setBusy] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function claim(giftId: string) {
        setBusy(giftId);
        setError(null);
        try {
            const res = await fetch("/api/claim-gift", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ giftId }),
            });
            const data = await res.json();
            if (!res.ok) setError(data.error ?? "Could not claim.");
            else router.refresh();
        } finally {
            setBusy(null);
        }
    }

    const kindIcon = (kind: string | null) =>
        kind === "certificate" ? ScrollText : kind === "gift" ? Gift : Award;

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="inline-flex rounded-full border border-white/[0.08] bg-white/[0.04] p-1">
                {(["unlocked", "shop"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={cn(
                            "rounded-full px-4 py-2 text-sm font-medium transition",
                            tab === t
                                ? "bg-gradient-to-r from-orange-600 to-red-600 text-white"
                                : "text-white/50 hover:text-white/80"
                        )}
                    >
                        {t === "unlocked" ? "Unlocked" : "Point Shop"}
                    </button>
                ))}
            </div>

            {error && (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {error}
                </div>
            )}

            {tab === "unlocked" ? (
                unlocked.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {unlocked.map((u) => {
                            const Icon = kindIcon(u.kind);
                            return (
                                <GlassCard key={u.id} hover className="flex items-center gap-4 p-5">
                                    <span className="flex size-12 items-center justify-center rounded-2xl bg-[#f15906]/12 text-[#f15906]">
                                        <Icon className="size-6" />
                                    </span>
                                    <div>
                                        <p className="font-medium text-white">{u.name}</p>
                                        <p className="text-xs capitalize text-white/45">{u.kind ?? "reward"}</p>
                                    </div>
                                </GlassCard>
                            );
                        })}
                    </div>
                ) : (
                    <GlassCard className="p-12 text-center">
                        <Award className="mx-auto size-8 text-white/30" />
                        <p className="mt-3 text-sm text-white/60">
                            No rewards unlocked yet — earn points and complete courses to unlock goodies.
                        </p>
                    </GlassCard>
                )
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {shop.map((g) => {
                        const affordable = balance >= g.cost;
                        const outOfStock = g.stock != null && g.stock <= 0;
                        return (
                            <GlassCard key={g.id} hover className="flex flex-col p-6">
                                <span className="flex size-12 items-center justify-center rounded-2xl bg-[#f15906]/12 text-[#f15906]">
                                    <Gift className="size-6" />
                                </span>
                                <h3 className="mt-4 font-semibold text-white">{g.title}</h3>
                                <p className="mt-1 flex-1 text-sm text-white/50">{g.description}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#f15906]">
                                        <Sparkles className="size-4" /> {g.cost} pts
                                    </span>
                                    <button
                                        onClick={() => claim(g.id)}
                                        disabled={!affordable || outOfStock || busy === g.id}
                                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        {busy === g.id ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : outOfStock ? (
                                            "Out of stock"
                                        ) : affordable ? (
                                            "Claim"
                                        ) : (
                                            "Not enough"
                                        )}
                                    </button>
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>
            )}

            {/* My claims */}
            {claims.length > 0 && (
                <div>
                    <h2 className="mb-3 mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                        My claims
                    </h2>
                    <div className="space-y-3">
                        {claims.map((c) => {
                            const rejected = c.status === "rejected";
                            const stepIdx = STEPS.indexOf(c.status);
                            return (
                                <GlassCard key={c.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                                    <p className="font-medium text-white">{c.title}</p>
                                    {rejected ? (
                                        <span className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-300">
                                            Rejected
                                        </span>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            {STEPS.map((s, i) => (
                                                <div key={s} className="flex items-center gap-2">
                                                    <span
                                                        className={cn(
                                                            "flex size-6 items-center justify-center rounded-full text-[10px] font-bold",
                                                            i <= stepIdx
                                                                ? "bg-gradient-to-br from-orange-600 to-red-600 text-white"
                                                                : "border border-white/15 text-white/30"
                                                        )}
                                                    >
                                                        {i <= stepIdx ? <Check className="size-3" strokeWidth={3} /> : i + 1}
                                                    </span>
                                                    <span className={cn("text-xs capitalize", i <= stepIdx ? "text-white/80" : "text-white/30")}>
                                                        {s}
                                                    </span>
                                                    {i < STEPS.length - 1 && <span className="text-white/15">—</span>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </GlassCard>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
