import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { evaluateRewards } from "@/lib/rewards/engine";
import { touchStreak } from "@/lib/rewards/streak";

const Body = z.object({ assignmentId: z.string().uuid() });

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const parsed = Body.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "bad request" }, { status: 400 });

    // Load the assignment (RLS ensures it's the user's own) + its task
    const { data: assignment } = await supabase
        .from("task_assignments")
        .select("id, status, task_id, tasks(points_reward, requires_approval)")
        .eq("id", parsed.data.assignmentId)
        .eq("user_id", user.id)
        .maybeSingle();
    if (!assignment) return NextResponse.json({ error: "not found" }, { status: 404 });
    if (assignment.status === "done" || assignment.status === "submitted") {
        return NextResponse.json({ status: assignment.status });
    }

    const task = assignment.tasks as unknown as { points_reward: number; requires_approval: boolean } | null;
    const requiresApproval = task?.requires_approval ?? false;

    if (requiresApproval) {
        // Awaits admin approval — no points yet
        await supabase.from("task_assignments").update({ status: "submitted" }).eq("id", assignment.id);
        return NextResponse.json({ status: "submitted" });
    }

    // Auto-complete + award points server-authoritatively
    const admin = createSupabaseAdminClient();
    await admin
        .from("task_assignments")
        .update({ status: "done", completed_at: new Date().toISOString() })
        .eq("id", assignment.id);

    let pointsAwarded = 0;
    const reward = task?.points_reward ?? 0;
    const { data: existing } = await admin
        .from("point_ledger")
        .select("id")
        .eq("user_id", user.id)
        .eq("reason", "task_done")
        .eq("ref_id", assignment.task_id)
        .maybeSingle();
    if (!existing && reward > 0) {
        await admin.from("point_ledger").insert({
            user_id: user.id,
            amount: reward,
            reason: "task_done",
            ref_id: assignment.task_id,
        });
        pointsAwarded = reward;
    }

    await touchStreak(admin, user.id);
    const newRewards = await evaluateRewards(user.id);

    return NextResponse.json({ status: "done", pointsAwarded, newRewards });
}
