"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { cn } from "@/lib/utils";
import { setClaimStatus, type ClaimStatus } from "./actions";

export type ClaimRow = {
    id: string;
    user: string;
    gift: string;
    cost: number | null;
    status: string;
    when: string;
};

const FILTERS = ["requested", "approved", "shipped", "rejected"] as const;

export function ClaimsQueue({ claims }: { claims: ClaimRow[] }) {
    const router = useRouter();
    const [filter, setFilter] = useState<(typeof FILTERS)[number]>("requested");
    const [pending, start] = useTransition();
    const rows = claims.filter((c) => c.status === filter);

    function act(id: string, target: ClaimStatus) {
        start(async () => {
            await setClaimStatus(id, target);
            router.refresh();
        });
    }

    return (
        <div className="space-y-5">
            <div className="inline-flex flex-wrap gap-1 rounded-full border border-white/[0.08] bg-white/[0.04] p-1">
                {FILTERS.map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "rounded-full px-3 py-1.5 text-xs font-medium capitalize transition",
                            filter === f ? "bg-gradient-to-r from-orange-600 to-red-600 text-white" : "text-white/50 hover:text-white/80"
                        )}
                    >
                        {f} ({claims.filter((c) => c.status === f).length})
                    </button>
                ))}
            </div>

            {rows.length === 0 ? (
                <GlassCard className="p-10 text-center text-sm text-white/50">No {filter} claims.</GlassCard>
            ) : (
                <div className="space-y-3">
                    {rows.map((c) => (
                        <GlassCard key={c.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                            <div>
                                <p className="font-medium text-white">{c.gift}</p>
                                <p className="text-xs text-white/45">
                                    {c.user} · {c.cost != null ? `${c.cost} pts` : "benchmark"} · {c.when}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {c.status === "requested" && (
                                    <>
                                        <Btn onClick={() => act(c.id, "approved")} disabled={pending} tone="ember">Approve</Btn>
                                        <Btn onClick={() => act(c.id, "rejected")} disabled={pending} tone="ghost">Reject{c.cost != null ? " + refund" : ""}</Btn>
                                    </>
                                )}
                                {c.status === "approved" && (
                                    <>
                                        <Btn onClick={() => act(c.id, "shipped")} disabled={pending} tone="ember">Mark shipped</Btn>
                                        <Btn onClick={() => act(c.id, "requested")} disabled={pending} tone="ghost">Revert to requested</Btn>
                                        <Btn onClick={() => act(c.id, "rejected")} disabled={pending} tone="danger">Reject</Btn>
                                    </>
                                )}
                                {c.status === "shipped" && (
                                    <>
                                        <Btn onClick={() => act(c.id, "approved")} disabled={pending} tone="ghost">Revert to approved</Btn>
                                        <Btn onClick={() => act(c.id, "rejected")} disabled={pending} tone="danger">Uproot{c.cost != null ? " + refund" : ""}</Btn>
                                    </>
                                )}
                                {c.status === "rejected" && (
                                    <Btn onClick={() => act(c.id, "requested")} disabled={pending} tone="ember">Reopen{c.cost != null ? " (re-charge)" : ""}</Btn>
                                )}
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    );
}

function Btn({ children, onClick, disabled, tone }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; tone: "ember" | "ghost" | "danger" }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-50",
                tone === "ember" && "bg-gradient-to-r from-orange-600 to-red-600 text-white hover:brightness-110",
                tone === "ghost" && "border border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.12]",
                tone === "danger" && "border border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
            )}
        >
            {children}
        </button>
    );
}
