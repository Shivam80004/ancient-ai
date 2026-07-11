"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { cn } from "@/lib/utils";
import { createRule, createGift, toggleActive } from "./actions";

export type RuleRow = { id: string; name: string; rule_type: string; threshold: number; reward_kind: string | null; is_active: boolean | null };
export type GiftRow = { id: string; title: string; point_cost: number | null; stock: number | null; is_active: boolean | null };

const input = "w-full rounded-xl border border-white/10 bg-[#0f0c0b] px-3 py-2 text-sm text-white placeholder-white/30 focus:border-[#f15906] focus:outline-none focus:ring-2 focus:ring-[#f15906]/30";
const btn = "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60";

const RULE_TYPES = ["points_threshold", "course_count", "task_count", "streak_days", "semester_complete"];

export function RulesManager({ rules, gifts }: { rules: RuleRow[]; gifts: GiftRow[] }) {
    const router = useRouter();
    const [pending, start] = useTransition();
    const refresh = () => router.refresh();

    const [rule, setRule] = useState({ name: "", rule_type: "points_threshold", threshold: 300, reward_kind: "badge" });
    const [gift, setGift] = useState({ title: "", description: "", point_cost: 500, stock: 50 });

    function Toggle({ table, id, value }: { table: "reward_rules" | "gifts"; id: string; value: boolean }) {
        return (
            <button
                onClick={() => start(async () => { await toggleActive(table, id, !value); refresh(); })}
                disabled={pending}
                className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition",
                    value ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-white/10 bg-white/[0.04] text-white/50"
                )}
            >
                {value ? "Active" : "Inactive"}
            </button>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Rules */}
            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">Reward rules</h2>
                <div className="mt-4 space-y-2">
                    {rules.map((r) => (
                        <div key={r.id} className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
                            <div>
                                <p className="text-sm font-medium text-white">{r.name}</p>
                                <p className="text-xs text-white/45">
                                    {r.rule_type.replace(/_/g, " ")} ≥ {r.threshold} → {r.reward_kind}
                                </p>
                            </div>
                            <Toggle table="reward_rules" id={r.id} value={!!r.is_active} />
                        </div>
                    ))}
                    {rules.length === 0 && <p className="text-sm text-white/50">No rules yet.</p>}
                </div>

                <div className="mt-4 space-y-2 border-t border-white/[0.06] pt-4">
                    <input className={input} placeholder="Rule name" value={rule.name} onChange={(e) => setRule({ ...rule, name: e.target.value })} />
                    <div className="flex gap-2">
                        <select className={input} value={rule.rule_type} onChange={(e) => setRule({ ...rule, rule_type: e.target.value })}>
                            {RULE_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                        </select>
                        <input className={input} type="number" placeholder="Threshold" value={rule.threshold} onChange={(e) => setRule({ ...rule, threshold: Number(e.target.value) })} />
                        <select className={input} value={rule.reward_kind} onChange={(e) => setRule({ ...rule, reward_kind: e.target.value })}>
                            <option value="badge">badge</option>
                            <option value="certificate">certificate</option>
                            <option value="gift">gift</option>
                        </select>
                    </div>
                    <button
                        className={btn}
                        disabled={pending || !rule.name.trim()}
                        onClick={() => start(async () => { await createRule(rule); setRule({ name: "", rule_type: "points_threshold", threshold: 300, reward_kind: "badge" }); refresh(); })}
                    >
                        <Plus className="size-4" /> Add rule
                    </button>
                </div>
            </GlassCard>

            {/* Gifts */}
            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">Gifts</h2>
                <div className="mt-4 space-y-2">
                    {gifts.map((g) => (
                        <div key={g.id} className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
                            <div>
                                <p className="text-sm font-medium text-white">{g.title}</p>
                                <p className="text-xs text-white/45">
                                    {g.point_cost != null ? `${g.point_cost} pts` : "benchmark"} · stock {g.stock ?? "∞"}
                                </p>
                            </div>
                            <Toggle table="gifts" id={g.id} value={!!g.is_active} />
                        </div>
                    ))}
                    {gifts.length === 0 && <p className="text-sm text-white/50">No gifts yet.</p>}
                </div>

                <div className="mt-4 space-y-2 border-t border-white/[0.06] pt-4">
                    <input className={input} placeholder="Gift title" value={gift.title} onChange={(e) => setGift({ ...gift, title: e.target.value })} />
                    <input className={input} placeholder="Description" value={gift.description} onChange={(e) => setGift({ ...gift, description: e.target.value })} />
                    <div className="flex gap-2">
                        <input className={input} type="number" placeholder="Point cost" value={gift.point_cost} onChange={(e) => setGift({ ...gift, point_cost: Number(e.target.value) })} />
                        <input className={input} type="number" placeholder="Stock" value={gift.stock} onChange={(e) => setGift({ ...gift, stock: Number(e.target.value) })} />
                    </div>
                    <button
                        className={btn}
                        disabled={pending || !gift.title.trim()}
                        onClick={() => start(async () => { await createGift(gift); setGift({ title: "", description: "", point_cost: 500, stock: 50 }); refresh(); })}
                    >
                        <Plus className="size-4" /> Add gift
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}
