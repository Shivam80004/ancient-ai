"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

/** Enroll the current user in a course (idempotent). RLS enforces user_id = auth.uid(). */
export async function enrollAction(courseId: string) {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "unauthorized" };

    const { error } = await supabase
        .from("enrollments")
        .upsert(
            { user_id: user.id, course_id: courseId },
            { onConflict: "user_id,course_id", ignoreDuplicates: true }
        );
    if (error) return { error: error.message };

    revalidatePath("/dashboard/courses");
    revalidatePath(`/dashboard/courses/${courseId}`);
    return { ok: true };
}
