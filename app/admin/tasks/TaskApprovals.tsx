"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { cn } from "@/lib/utils";
import { setTaskStatus, type TaskStatus } from "./actions";

export type TaskRow = {
    id: string;
    status: "submitted" | "done" | "rejected";
    user: string;
    task: string;
    points: number;
};

const FILTERS = ["submitted", "done", "rejected"] as const;

export function TaskApprovals({ tasks }: { tasks: TaskRow[] }) {
    const router = useRouter();
    const [filter, setFilter] = useState<(typeof FILTERS)[number]>("submitted");
    const [pending, start] = useTransition();
    const rows = tasks.filter((t) => t.status === filter);

    function act(id: string, target: TaskStatus) {
        start(async () => {
            await setTaskStatus(id, target);
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
                        {f} ({tasks.filter((t) => t.status === f).length})
                    </button>
                ))}
            </div>

            {rows.length === 0 ? (
                <GlassCard className="p-10 text-center text-sm text-white/50">No {filter} tasks.</GlassCard>
            ) : (
                <div className="space-y-3">
                    {rows.map((t) => (
                        <GlassCard key={t.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                            <div>
                                <p className="font-medium text-white">{t.task}</p>
                                <p className="text-xs text-white/45">{t.user} · +{t.points} pts</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {t.status === "submitted" && (
                                    <>
                                        <Btn onClick={() => act(t.id, "done")} disabled={pending} tone="ember">Approve</Btn>
                                        <Btn onClick={() => act(t.id, "rejected")} disabled={pending} tone="danger">Reject</Btn>
                                    </>
                                )}
                                {t.status === "done" && (
                                    <Btn onClick={() => act(t.id, "submitted")} disabled={pending} tone="ghost">Un-approve (revert)</Btn>
                                )}
                                {t.status === "rejected" && (
                                    <Btn onClick={() => act(t.id, "submitted")} disabled={pending} tone="ember">Reopen</Btn>
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
