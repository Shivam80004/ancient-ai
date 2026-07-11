import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { TasksList, type TaskVM } from "./TasksList";

export const metadata: Metadata = { title: "Tasks" };

export default async function TasksPage() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: assignments } = await supabase
        .from("task_assignments")
        .select("id, status, tasks(title, description, criteria, points_reward, requires_approval)")
        .eq("user_id", user.id)
        .order("created_at");

    const tasks: TaskVM[] = (assignments ?? []).map((a) => {
        const t = a.tasks as unknown as {
            title: string;
            description: string | null;
            criteria: string | null;
            points_reward: number;
            requires_approval: boolean;
        } | null;
        return {
            id: a.id,
            title: t?.title ?? "Task",
            description: t?.description ?? null,
            criteria: t?.criteria ?? null,
            points: t?.points_reward ?? 0,
            requiresApproval: t?.requires_approval ?? false,
            status: (a.status as TaskVM["status"]) ?? "pending",
        };
    });

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">
                    Your tasks
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Tasks</h1>
                <p className="mt-1 text-sm text-white/50">
                    Tick a task when it&apos;s done to earn points. Some tasks need admin approval first.
                </p>
            </div>
            <TasksList tasks={tasks} />
        </div>
    );
}
