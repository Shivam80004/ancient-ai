"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { approveTask, rejectTask } from "./actions";

export type PendingTask = { id: string; user: string; task: string; points: number };

export function TaskApprovals({ tasks }: { tasks: PendingTask[] }) {
    const router = useRouter();
    const [pending, start] = useTransition();

    function act(id: string, approve: boolean) {
        start(async () => {
            if (approve) await approveTask(id);
            else await rejectTask(id);
            router.refresh();
        });
    }

    if (tasks.length === 0)
        return <GlassCard className="p-10 text-center text-sm text-white/50">No tasks awaiting approval.</GlassCard>;

    return (
        <div className="space-y-3">
            {tasks.map((t) => (
                <GlassCard key={t.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div>
                        <p className="font-medium text-white">{t.task}</p>
                        <p className="text-xs text-white/45">{t.user} · +{t.points} pts</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => act(t.id, true)}
                            disabled={pending}
                            className="rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => act(t.id, false)}
                            disabled={pending}
                            className="rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:opacity-50"
                        >
                            Reject
                        </button>
                    </div>
                </GlassCard>
            ))}
        </div>
    );
}
