import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type Stats = {
    points: number;
    coursesDone: number;
    tasksDone: number;
    streakDays: number;
    completedSemesters: string[];
};

type Rule = {
    id: string;
    rule_type: string;
    threshold: number;
    semester_id: string | null;
    reward_kind: string | null;
    reward_ref: string | null;
};

function checkRule(rule: Rule, s: Stats): boolean {
    switch (rule.rule_type) {
        case "points_threshold":
            return s.points >= rule.threshold;
        case "course_count":
            return s.coursesDone >= rule.threshold;
        case "task_count":
            return s.tasksDone >= rule.threshold;
        case "streak_days":
            return s.streakDays >= rule.threshold;
        case "semester_complete":
            return rule.semester_id ? s.completedSemesters.includes(rule.semester_id) : false;
        default:
            return false;
    }
}

/**
 * Evaluate every active reward rule for a user and grant any newly-earned
 * rewards (idempotent via earned_rewards' unique(user_id, rule_id)).
 * Runs with the service-role client — server only. Returns names granted this run.
 */
export async function evaluateRewards(userId: string): Promise<string[]> {
    const admin = createSupabaseAdminClient();

    const [{ data: profile }, { data: doneEnroll }, { data: doneTasks }, { data: streak }] =
        await Promise.all([
            admin.from("profiles").select("total_points").eq("id", userId).single(),
            admin.from("enrollments").select("course_id").eq("user_id", userId).eq("status", "completed"),
            admin.from("task_assignments").select("id").eq("user_id", userId).eq("status", "done"),
            admin.from("streaks").select("current_streak").eq("user_id", userId).maybeSingle(),
        ]);

    const completedCourseIds = new Set((doneEnroll ?? []).map((e) => e.course_id));

    // A semester is "complete" when the user has completed all its published courses.
    const { data: semesters } = await admin
        .from("semesters")
        .select("id, courses(id, is_published)")
        .eq("is_published", true);
    const completedSemesters: string[] = [];
    for (const sem of semesters ?? []) {
        const published = (sem.courses ?? []).filter((c: { is_published: boolean | null }) => c.is_published);
        if (published.length > 0 && published.every((c: { id: string }) => completedCourseIds.has(c.id))) {
            completedSemesters.push(sem.id);
        }
    }

    const stats: Stats = {
        points: profile?.total_points ?? 0,
        coursesDone: (doneEnroll ?? []).length,
        tasksDone: (doneTasks ?? []).length,
        streakDays: streak?.current_streak ?? 0,
        completedSemesters,
    };

    const { data: rules } = await admin.from("reward_rules").select("*").eq("is_active", true);
    const granted: string[] = [];

    for (const rule of (rules ?? []) as unknown as (Rule & { name: string })[]) {
        if (!checkRule(rule, stats)) continue;
        // Insert if new; unique(user_id, rule_id) makes replays no-ops.
        const { error } = await admin.from("earned_rewards").insert({
            user_id: userId,
            rule_id: rule.id,
            reward_kind: rule.reward_kind,
            reward_ref: rule.reward_ref,
        });
        if (!error) granted.push(rule.name);
    }

    return granted;
}
