import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { evaluateRewards } from "@/lib/rewards/engine";
import { touchStreak } from "@/lib/rewards/streak";

const Body = z.object({ lessonId: z.string().uuid() });

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const json = await req.json().catch(() => null);
    const parsed = Body.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "bad request" }, { status: 400 });
    const { lessonId } = parsed.data;

    // Resolve the lesson's course
    const { data: lesson } = await supabase
        .from("lessons")
        .select("id, course_id")
        .eq("id", lessonId)
        .single();
    if (!lesson?.course_id) return NextResponse.json({ error: "lesson not found" }, { status: 404 });
    const courseId = lesson.course_id;

    // Must be enrolled
    const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id, status")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();
    if (!enrollment) return NextResponse.json({ error: "not enrolled" }, { status: 403 });

    // Idempotent completion (RLS: users may write their own completions)
    await supabase
        .from("lesson_completions")
        .upsert(
            { user_id: user.id, lesson_id: lessonId },
            { onConflict: "user_id,lesson_id", ignoreDuplicates: true }
        );

    // Course progress
    const { data: courseLessons } = await supabase
        .from("lessons")
        .select("id")
        .eq("course_id", courseId);
    const lessonIds = (courseLessons ?? []).map((l) => l.id);
    const total = lessonIds.length;
    const { data: comps } = await supabase
        .from("lesson_completions")
        .select("lesson_id")
        .eq("user_id", user.id)
        .in("lesson_id", lessonIds.length ? lessonIds : ["00000000-0000-0000-0000-000000000000"]);
    const done = (comps ?? []).length;

    // Count today's activity toward the daily streak
    try {
        await touchStreak(createSupabaseAdminClient(), user.id);
    } catch {
        /* streak is best-effort */
    }

    let courseComplete = false;
    let pointsAwarded = 0;
    let newRewards: string[] = [];

    if (total > 0 && done >= total) {
        courseComplete = true;
        const admin = createSupabaseAdminClient(); // service-role for the authoritative writes

        if (enrollment.status !== "completed") {
            await admin
                .from("enrollments")
                .update({ status: "completed", completed_at: new Date().toISOString() })
                .eq("id", enrollment.id);
        }

        // Award course points once (guard by existing ledger row for this course)
        const { data: course } = await admin
            .from("courses")
            .select("points_reward")
            .eq("id", courseId)
            .single();
        const reward = course?.points_reward ?? 0;

        const { data: existing } = await admin
            .from("point_ledger")
            .select("id")
            .eq("user_id", user.id)
            .eq("reason", "course_complete")
            .eq("ref_id", courseId)
            .maybeSingle();

        if (!existing && reward > 0) {
            await admin.from("point_ledger").insert({
                user_id: user.id,
                amount: reward,
                reason: "course_complete",
                ref_id: courseId,
            });
            pointsAwarded = reward;
        }

        newRewards = await evaluateRewards(user.id);
    }

    return NextResponse.json({ done, total, courseComplete, pointsAwarded, newRewards });
}
