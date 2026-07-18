import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { CourseView } from "./CourseView";

export const metadata: Metadata = { title: "Course" };

export default async function CourseDetailPage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // RLS returns the course only if it's published
    const { data: course } = await supabase
        .from("courses")
        .select("id, title, description, points_reward, thumbnail_url")
        .eq("id", courseId)
        .maybeSingle();
    if (!course) notFound();

    const { data: lessons } = await supabase
        .from("lessons")
        .select("id, title, content_type, content_url, body, duration_minutes, thumbnail_url")
        .eq("course_id", courseId)
        .order("order_index");

    const lessonIds = (lessons ?? []).map((l) => l.id);
    const { data: comps } = await supabase
        .from("lesson_completions")
        .select("lesson_id")
        .eq("user_id", user.id)
        .in("lesson_id", lessonIds.length ? lessonIds : ["00000000-0000-0000-0000-000000000000"]);

    const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();

    return (
        <CourseView
            course={course}
            lessons={lessons ?? []}
            completedIds={(comps ?? []).map((c) => c.lesson_id!).filter(Boolean)}
            enrolled={!!enrollment}
        />
    );
}
