"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock, Loader2, CircleDashed } from "lucide-react";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { cn } from "@/lib/utils";

export type TaskVM = {
    id: string; // assignment id
    title: string;
    description: string | null;
    criteria: string | null;
    points: number;
    requiresApproval: boolean;
    status: "pending" | "submitted" | "done" | "rejected";
};

export function TasksList({ tasks: initial }: { tasks: TaskVM[] }) {
    const router = useRouter();
    const [tasks, setTasks] = useState(initial);
    const [busy, setBusy] = useState<string | null>(null);

    async function complete(id: string) {
        setBusy(id);
        try {
            const res = await fetch("/api/complete-task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assignmentId: id }),
            });
            const data = await res.json();
            if (res.ok) {
                setTasks((prev) =>
                    prev.map((t) => (t.id === id ? { ...t, status: data.status } : t))
                );
                router.refresh();
            }
        } finally {
            setBusy(null);
        }
    }

    const groups: { key: string; label: string; items: TaskVM[] }[] = [
        { key: "todo", label: "To do", items: tasks.filter((t) => t.status === "pending" || t.status === "rejected") },
        { key: "submitted", label: "Submitted", items: tasks.filter((t) => t.status === "submitted") },
        { key: "done", label: "Done", items: tasks.filter((t) => t.status === "done") },
    ];

    if (tasks.length === 0) {
        return (
            <GlassCard className="p-12 text-center">
                <CircleDashed className="mx-auto size-8 text-white/30" />
                <p className="mt-3 text-sm text-white/60">No tasks assigned yet.</p>
            </GlassCard>
        );
    }

    return (
        <div className="space-y-8">
            {groups.map(
                (g) =>
                    g.items.length > 0 && (
                        <div key={g.key}>
                            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                                {g.label} · {g.items.length}
                            </h2>
                            <div className="space-y-3">
                                {g.items.map((t) => {
                                    const isDone = t.status === "done";
                                    const isSubmitted = t.status === "submitted";
                                    return (
                                        <GlassCard key={t.id} className={cn("p-5", isDone && "opacity-70")}>
                                            <div className="flex items-start gap-4">
                                                <button
                                                    onClick={() => !isDone && !isSubmitted && complete(t.id)}
                                                    disabled={isDone || isSubmitted || busy === t.id}
                                                    aria-label="Mark task done"
                                                    className={cn(
                                                        "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border transition",
                                                        isDone
                                                            ? "border-transparent bg-gradient-to-br from-orange-600 to-red-600 text-white"
                                                            : isSubmitted
                                                            ? "border-amber-400/40 text-amber-300"
                                                            : "border-white/20 text-white/40 hover:border-[#f15906] hover:text-[#f15906]"
                                                    )}
                                                >
                                                    {busy === t.id ? (
                                                        <Loader2 className="size-4 animate-spin" />
                                                    ) : isDone ? (
                                                        <Check className="size-4" strokeWidth={3} />
                                                    ) : isSubmitted ? (
                                                        <Clock className="size-3.5" />
                                                    ) : null}
                                                </button>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <p className={cn("font-medium text-white", isDone && "line-through")}>
                                                            {t.title}
                                                        </p>
                                                        <span className="shrink-0 text-xs font-semibold text-[#f15906]">
                                                            +{t.points} pts
                                                        </span>
                                                    </div>
                                                    {t.description && (
                                                        <p className="mt-1 text-sm text-white/50">{t.description}</p>
                                                    )}
                                                    {t.criteria && (
                                                        <p className="mt-2 text-xs text-white/35">✓ {t.criteria}</p>
                                                    )}
                                                    {isSubmitted && (
                                                        <p className="mt-2 text-xs text-amber-300/80">
                                                            Submitted — awaiting admin approval.
                                                        </p>
                                                    )}
                                                    {t.requiresApproval && t.status === "pending" && (
                                                        <p className="mt-2 text-xs text-white/35">Requires approval after you submit.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </GlassCard>
                                    );
                                })}
                            </div>
                        </div>
                    )
            )}
        </div>
    );
}
