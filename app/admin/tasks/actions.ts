"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { evaluateRewards } from "@/lib/rewards/engine";
import { reconcilePoints } from "@/lib/rewards/reconcile";

export type TaskStatus = "pending" | "submitted" | "done" | "rejected";

/**
 * Set a task assignment's status (forward or backward). Points reconcile to the
 * reward when "done", else 0 — so approving awards points and un-approving removes them.
 */
export async function setTaskStatus(assignmentId: string, target: TaskStatus) {
    await requireAdmin();
    const admin = createSupabaseAdminClient();

    const { data: a } = await admin
        .from("task_assignments")
        .select("id, user_id, task_id, status, tasks(points_reward)")
        .eq("id", assignmentId)
        .single();
    if (!a) return { error: "assignment not found" };

    await admin
        .from("task_assignments")
        .update({ status: target, completed_at: target === "done" ? new Date().toISOString() : null })
        .eq("id", assignmentId);

    const reward = (a.tasks as unknown as { points_reward: number } | null)?.points_reward ?? 0;
    if (a.user_id && a.task_id) {
        await reconcilePoints(admin, a.user_id, a.task_id, "task_adjust", target === "done" ? reward : 0, [
            "task_done",
            "task_adjust",
        ]);
        await evaluateRewards(a.user_id);
    }

    revalidatePath("/admin/tasks");
    return { ok: true };
}

// Back-compat wrappers.
export async function approveTask(assignmentId: string) {
    return setTaskStatus(assignmentId, "done");
}
export async function rejectTask(assignmentId: string) {
    return setTaskStatus(assignmentId, "rejected");
}
