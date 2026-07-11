"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { evaluateRewards } from "@/lib/rewards/engine";

export async function approveTask(assignmentId: string) {
    await requireAdmin();
    const admin = createSupabaseAdminClient();

    const { data: a } = await admin
        .from("task_assignments")
        .select("id, user_id, task_id, status, tasks(points_reward)")
        .eq("id", assignmentId)
        .single();
    if (!a || a.status !== "submitted") return { error: "not pending approval" };

    await admin
        .from("task_assignments")
        .update({ status: "done", completed_at: new Date().toISOString() })
        .eq("id", assignmentId);

    const reward = (a.tasks as unknown as { points_reward: number } | null)?.points_reward ?? 0;
    const { data: existing } = await admin
        .from("point_ledger")
        .select("id")
        .eq("user_id", a.user_id!)
        .eq("reason", "task_done")
        .eq("ref_id", a.task_id!)
        .maybeSingle();
    if (!existing && reward > 0) {
        await admin.from("point_ledger").insert({
            user_id: a.user_id,
            amount: reward,
            reason: "task_done",
            ref_id: a.task_id,
        });
    }
    if (a.user_id) await evaluateRewards(a.user_id);

    revalidatePath("/admin/tasks");
    return { ok: true };
}

export async function rejectTask(assignmentId: string) {
    await requireAdmin();
    const admin = createSupabaseAdminClient();
    await admin.from("task_assignments").update({ status: "rejected" }).eq("id", assignmentId);
    revalidatePath("/admin/tasks");
    return { ok: true };
}
