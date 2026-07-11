import type { Metadata } from "next";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { TaskApprovals, type PendingTask } from "./TaskApprovals";

export const metadata: Metadata = { title: "Admin · Tasks" };
export const dynamic = "force-dynamic";

export default async function AdminTasksPage() {
    const admin = createSupabaseAdminClient();

    const { data: submitted } = await admin
        .from("task_assignments")
        .select("id, tasks(title, points_reward), profiles(full_name)")
        .eq("status", "submitted")
        .order("created_at");

    const tasks: PendingTask[] = (submitted ?? []).map((a) => ({
        id: a.id,
        task: (a.tasks as unknown as { title: string } | null)?.title ?? "Task",
        points: (a.tasks as unknown as { points_reward: number } | null)?.points_reward ?? 0,
        user: (a.profiles as unknown as { full_name: string | null } | null)?.full_name ?? "Learner",
    }));

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">Admin</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Task Approvals</h1>
                <p className="mt-1 text-sm text-white/50">Tasks submitted for review. Approving awards the points.</p>
            </div>
            <TaskApprovals tasks={tasks} />
        </div>
    );
}
