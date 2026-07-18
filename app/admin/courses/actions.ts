"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

// Admin curriculum mutations. requireAdmin() gates every call; the authenticated
// admin's RLS policies (is_admin()) permit the writes.
async function adminDb() {
    await requireAdmin();
    return createSupabaseServerClient();
}

async function nextOrder(db: Awaited<ReturnType<typeof createSupabaseServerClient>>, table: string, col: string, val: string | null) {
    let q = db.from(table).select("order_index").order("order_index", { ascending: false }).limit(1);
    if (val) q = q.eq(col, val);
    const { data } = await q.maybeSingle();
    return ((data?.order_index as number | undefined) ?? 0) + 1;
}

export async function createSemester(title: string, thumbnailUrl?: string | null) {
    const db = await adminDb();
    const order_index = await nextOrder(db, "semesters", "", null);
    const { error } = await db
        .from("semesters")
        .insert({ title, order_index, is_published: false, thumbnail_url: thumbnailUrl ?? null });
    revalidatePath("/admin/courses");
    return error ? { error: error.message } : { ok: true };
}

export async function createCourse(input: {
    semesterId: string;
    title: string;
    description: string;
    difficulty: string;
    points: number;
    thumbnailUrl?: string | null;
}) {
    const db = await adminDb();
    const order_index = await nextOrder(db, "courses", "semester_id", input.semesterId);
    const { error } = await db.from("courses").insert({
        semester_id: input.semesterId,
        title: input.title,
        description: input.description,
        difficulty: input.difficulty,
        points_reward: input.points,
        thumbnail_url: input.thumbnailUrl ?? null,
        order_index,
        is_published: false,
    });
    revalidatePath("/admin/courses");
    return error ? { error: error.message } : { ok: true };
}

export async function createLesson(input: {
    courseId: string;
    title: string;
    contentType: "video" | "article" | "quiz";
    contentUrl?: string | null;
    body?: string | null;
    duration?: number;
    thumbnailUrl?: string | null;
}) {
    const db = await adminDb();
    const order_index = await nextOrder(db, "lessons", "course_id", input.courseId);
    const { error } = await db.from("lessons").insert({
        course_id: input.courseId,
        title: input.title,
        content_type: input.contentType,
        content_url: input.contentUrl ?? null,
        body: input.body ?? null,
        duration_minutes: input.duration ?? 0,
        thumbnail_url: input.thumbnailUrl ?? null,
        order_index,
    });
    revalidatePath("/admin/courses");
    return error ? { error: error.message } : { ok: true };
}

/** Set/replace the thumbnail on an existing semester, course, or lesson. */
export async function setThumbnail(table: "semesters" | "courses" | "lessons", id: string, url: string) {
    const db = await adminDb();
    const { error } = await db.from(table).update({ thumbnail_url: url }).eq("id", id);
    revalidatePath("/admin/courses");
    return error ? { error: error.message } : { ok: true };
}

export async function togglePublish(table: "semesters" | "courses", id: string, value: boolean) {
    const db = await adminDb();
    const { error } = await db.from(table).update({ is_published: value }).eq("id", id);
    revalidatePath("/admin/courses");
    return error ? { error: error.message } : { ok: true };
}

export async function deleteRow(table: "semesters" | "courses" | "lessons", id: string) {
    const db = await adminDb();
    const { error } = await db.from(table).delete().eq("id", id);
    revalidatePath("/admin/courses");
    return error ? { error: error.message } : { ok: true };
}
