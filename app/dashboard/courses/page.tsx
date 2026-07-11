import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { SemesterTabs, type SemesterVM } from "./SemesterTabs";

export const metadata: Metadata = { title: "Courses" };

export default async function CoursesPage() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // RLS returns only published semesters/courses.
    const { data: semesters } = await supabase
        .from("semesters")
        .select("id, title, courses(id, title, description, difficulty, points_reward, order_index)")
        .eq("is_published", true)
        .order("order_index")
        .order("order_index", { referencedTable: "courses" });

    const { data: enrollments } = await supabase
        .from("enrollments")
        .select("course_id, status")
        .eq("user_id", user.id);
    const statusByCourse = new Map(
        (enrollments ?? []).map((e) => [e.course_id, e.status as string])
    );

    // Lesson totals + user's completions (RLS-scoped) for progress bars
    const { data: lessons } = await supabase.from("lessons").select("id, course_id");
    const totalByCourse = new Map<string, number>();
    const lessonToCourse = new Map<string, string>();
    for (const l of lessons ?? []) {
        if (!l.course_id) continue;
        totalByCourse.set(l.course_id, (totalByCourse.get(l.course_id) ?? 0) + 1);
        lessonToCourse.set(l.id, l.course_id);
    }
    const { data: comps } = await supabase
        .from("lesson_completions")
        .select("lesson_id")
        .eq("user_id", user.id);
    const doneByCourse = new Map<string, number>();
    for (const c of comps ?? []) {
        const courseId = lessonToCourse.get(c.lesson_id!);
        if (courseId) doneByCourse.set(courseId, (doneByCourse.get(courseId) ?? 0) + 1);
    }

    const vm: SemesterVM[] = (semesters ?? []).map((s) => ({
        id: s.id,
        title: s.title,
        courses: (s.courses ?? []).map((c) => {
            const enrollStatus = statusByCourse.get(c.id);
            const status: "none" | "in_progress" | "completed" =
                enrollStatus === "completed"
                    ? "completed"
                    : enrollStatus === "in_progress"
                    ? "in_progress"
                    : "none";
            return {
                id: c.id,
                title: c.title,
                description: c.description,
                difficulty: c.difficulty,
                points_reward: c.points_reward,
                total: totalByCourse.get(c.id) ?? 0,
                done: doneByCourse.get(c.id) ?? 0,
                status,
            };
        }),
    }));

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">
                    Curriculum
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Courses</h1>
                <p className="mt-1 text-sm text-white/50">
                    Progress through the semesters. Complete every lesson in a course to earn its points.
                </p>
            </div>
            <SemesterTabs semesters={vm} />
        </div>
    );
}
