"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Check, Trash2, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { cn } from "@/lib/utils";
import { createRule, createGift, toggleActive, updateRule, updateGift, deleteRewardRow } from "./actions";

export type RuleRow = { id: string; name: string; rule_type: string; threshold: number; reward_kind: string | null; is_active: boolean | null };
export type GiftRow = { id: string; title: string; description?: string | null; point_cost: number | null; stock: number | null; is_active: boolean | null };

const input = "w-full rounded-xl border border-white/10 bg-[#0f0c0b] px-3 py-2 text-sm text-white placeholder-white/30 focus:border-[#f15906] focus:outline-none focus:ring-2 focus:ring-[#f15906]/30";
const btn = "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60";
const ghostBtn = "inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/[0.08]";

const RULE_TYPES = ["points_threshold", "course_count", "task_count", "streak_days", "semester_complete"];

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
    return (
        <label className={cn("block", className)}>
            <span className="mb-1 block text-xs font-medium text-white/50">{label}</span>
            {children}
        </label>
    );
}

function Toggle({ table, id, value }: { table: "reward_rules" | "gifts"; id: string; value: boolean }) {
    const router = useRouter();
    const [pending, start] = useTransition();
    return (
        <button
            onClick={() => start(async () => { await toggleActive(table, id, !value); router.refresh(); })}
            disabled={pending}
            className={cn("rounded-full border px-3 py-1 text-xs font-medium transition", value ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-white/10 bg-white/[0.04] text-white/50")}
        >
            {value ? "Active" : "Inactive"}
        </button>
    );
}

function DeleteBtn({ table, id }: { table: "reward_rules" | "gifts"; id: string }) {
    const router = useRouter();
    const [pending, start] = useTransition();
    return (
        <button
            onClick={() => { if (!confirm("Delete this?")) return; start(async () => { await deleteRewardRow(table, id); router.refresh(); }); }}
            disabled={pending}
            className="rounded-full border border-white/10 bg-white/[0.04] p-1.5 text-white/50 transition hover:border-rose-500/30 hover:text-rose-300"
            aria-label="Delete"
        >
            {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
        </button>
    );
}

function EditBtn({ onClick }: { onClick: () => void }) {
    return (
        <button onClick={onClick} title="Edit" aria-label="Edit" className="rounded-full border border-white/10 bg-white/[0.04] p-1.5 text-white/50 transition hover:text-white">
            <Pencil className="size-3.5" />
        </button>
    );
}

function RuleItem({ r }: { r: RuleRow }) {
    const router = useRouter();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: r.name, rule_type: r.rule_type, threshold: r.threshold, reward_kind: r.reward_kind ?? "badge" });
    const [pending, start] = useTransition();

    if (editing) {
        return (
            <div className="space-y-2 rounded-2xl border border-[#f15906]/20 bg-[#f15906]/[0.04] p-3">
                <Field label="Rule name"><input className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
                <div className="flex gap-2">
                    <Field label="Rule type" className="flex-1">
                        <select className={input} value={form.rule_type} onChange={(e) => setForm({ ...form, rule_type: e.target.value })}>
                            {RULE_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                        </select>
                    </Field>
                    <Field label="Threshold" className="w-28"><input className={input} type="number" value={form.threshold} onChange={(e) => setForm({ ...form, threshold: Number(e.target.value) })} /></Field>
                    <Field label="Reward" className="flex-1">
                        <select className={input} value={form.reward_kind} onChange={(e) => setForm({ ...form, reward_kind: e.target.value })}>
                            <option value="badge">badge</option>
                            <option value="certificate">certificate</option>
                            <option value="gift">gift</option>
                        </select>
                    </Field>
                </div>
                <div className="flex gap-2">
                    <button className={btn} disabled={pending || !form.name.trim()} onClick={() => start(async () => { await updateRule(r.id, form); setEditing(false); router.refresh(); })}><Check className="size-4" /> Save</button>
                    <button className={ghostBtn} onClick={() => setEditing(false)}>Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div>
                <p className="text-sm font-medium text-white">{r.name}</p>
                <p className="text-xs text-white/45">{r.rule_type.replace(/_/g, " ")} ≥ {r.threshold} → {r.reward_kind}</p>
            </div>
            <div className="flex items-center gap-2">
                <EditBtn onClick={() => setEditing(true)} />
                <Toggle table="reward_rules" id={r.id} value={!!r.is_active} />
                <DeleteBtn table="reward_rules" id={r.id} />
            </div>
        </div>
    );
}

function GiftItem({ g }: { g: GiftRow }) {
    const router = useRouter();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ title: g.title, description: g.description ?? "", point_cost: g.point_cost ?? 0, stock: g.stock ?? 0 });
    const [pending, start] = useTransition();

    if (editing) {
        return (
            <div className="space-y-2 rounded-2xl border border-[#f15906]/20 bg-[#f15906]/[0.04] p-3">
                <Field label="Gift title"><input className={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
                <Field label="Description"><input className={input} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
                <div className="flex gap-2">
                    <Field label="Point cost" className="flex-1"><input className={input} type="number" value={form.point_cost} onChange={(e) => setForm({ ...form, point_cost: Number(e.target.value) })} /></Field>
                    <Field label="Stock" className="flex-1"><input className={input} type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} /></Field>
                </div>
                <div className="flex gap-2">
                    <button className={btn} disabled={pending || !form.title.trim()} onClick={() => start(async () => { await updateGift(g.id, form); setEditing(false); router.refresh(); })}><Check className="size-4" /> Save</button>
                    <button className={ghostBtn} onClick={() => setEditing(false)}>Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div>
                <p className="text-sm font-medium text-white">{g.title}</p>
                <p className="text-xs text-white/45">{g.point_cost != null ? `${g.point_cost} pts` : "benchmark"} · stock {g.stock ?? "∞"}</p>
            </div>
            <div className="flex items-center gap-2">
                <EditBtn onClick={() => setEditing(true)} />
                <Toggle table="gifts" id={g.id} value={!!g.is_active} />
                <DeleteBtn table="gifts" id={g.id} />
            </div>
        </div>
    );
}

export function RulesManager({ rules, gifts }: { rules: RuleRow[]; gifts: GiftRow[] }) {
    const router = useRouter();
    const [pending, start] = useTransition();
    const refresh = () => router.refresh();

    const [rule, setRule] = useState({ name: "", rule_type: "points_threshold", threshold: 300, reward_kind: "badge" });
    const [gift, setGift] = useState({ title: "", description: "", point_cost: 500, stock: 50 });

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Rules */}
            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">Reward rules</h2>
                <div className="mt-4 space-y-2">
                    {rules.map((r) => <RuleItem key={r.id} r={r} />)}
                    {rules.length === 0 && <p className="text-sm text-white/50">No rules yet.</p>}
                </div>

                <div className="mt-4 space-y-2 border-t border-white/[0.06] pt-4">
                    <Field label="Rule name"><input className={input} placeholder="e.g. First 300 Points" value={rule.name} onChange={(e) => setRule({ ...rule, name: e.target.value })} /></Field>
                    <div className="flex gap-2">
                        <Field label="Rule type" className="flex-1">
                            <select className={input} value={rule.rule_type} onChange={(e) => setRule({ ...rule, rule_type: e.target.value })}>
                                {RULE_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                            </select>
                        </Field>
                        <Field label="Threshold" className="w-28"><input className={input} type="number" placeholder="300" value={rule.threshold} onChange={(e) => setRule({ ...rule, threshold: Number(e.target.value) })} /></Field>
                        <Field label="Reward" className="flex-1">
                            <select className={input} value={rule.reward_kind} onChange={(e) => setRule({ ...rule, reward_kind: e.target.value })}>
                                <option value="badge">badge</option>
                                <option value="certificate">certificate</option>
                                <option value="gift">gift</option>
                            </select>
                        </Field>
                    </div>
                    <button className={btn} disabled={pending || !rule.name.trim()} onClick={() => start(async () => { await createRule(rule); setRule({ name: "", rule_type: "points_threshold", threshold: 300, reward_kind: "badge" }); refresh(); })}>
                        <Plus className="size-4" /> Add rule
                    </button>
                </div>
            </GlassCard>

            {/* Gifts */}
            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">Gifts</h2>
                <div className="mt-4 space-y-2">
                    {gifts.map((g) => <GiftItem key={g.id} g={g} />)}
                    {gifts.length === 0 && <p className="text-sm text-white/50">No gifts yet.</p>}
                </div>

                <div className="mt-4 space-y-2 border-t border-white/[0.06] pt-4">
                    <Field label="Gift title"><input className={input} placeholder="e.g. Ancient AI Hoodie" value={gift.title} onChange={(e) => setGift({ ...gift, title: e.target.value })} /></Field>
                    <Field label="Description"><input className={input} placeholder="Short description" value={gift.description} onChange={(e) => setGift({ ...gift, description: e.target.value })} /></Field>
                    <div className="flex gap-2">
                        <Field label="Point cost" className="flex-1"><input className={input} type="number" placeholder="500" value={gift.point_cost} onChange={(e) => setGift({ ...gift, point_cost: Number(e.target.value) })} /></Field>
                        <Field label="Stock" className="flex-1"><input className={input} type="number" placeholder="50" value={gift.stock} onChange={(e) => setGift({ ...gift, stock: Number(e.target.value) })} /></Field>
                    </div>
                    <button className={btn} disabled={pending || !gift.title.trim()} onClick={() => start(async () => { await createGift(gift); setGift({ title: "", description: "", point_cost: 500, stock: 50 }); refresh(); })}>
                        <Plus className="size-4" /> Add gift
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}
