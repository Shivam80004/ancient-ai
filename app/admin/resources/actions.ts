"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

// Admin gate + untyped client (admin RLS permits; no types regen needed).
async function adminDb() {
    await requireAdmin();
    return createSupabaseServerClient();
}

/* ── Categories ── */
export async function createCategory(name: string, description: string) {
    const db = await adminDb();
    const { error } = await db.from("resource_categories").insert({ name, description: description || null });
    revalidatePath("/admin/resources");
    return error ? { error: error.message } : { ok: true };
}
export async function updateCategory(id: string, name: string, description: string) {
    const db = await adminDb();
    const { error } = await db.from("resource_categories").update({ name, description: description || null }).eq("id", id);
    revalidatePath("/admin/resources");
    return error ? { error: error.message } : { ok: true };
}
export async function deleteCategory(id: string) {
    const db = await adminDb();
    const { error } = await db.from("resource_categories").delete().eq("id", id);
    revalidatePath("/admin/resources");
    return error ? { error: error.message } : { ok: true };
}

/* ── Resources ── */
export type ResourceInput = {
    category_id: string | null;
    kind: "pdf" | "image" | "video" | "quote" | "link" | "file";
    title: string;
    description: string;
    file_url: string | null;
    poster_url: string | null;
    body: string | null;
};

export async function createResource(input: ResourceInput) {
    const db = await adminDb();
    const { error } = await db.from("resources").insert({
        category_id: input.category_id,
        kind: input.kind,
        title: input.title,
        description: input.description || null,
        file_url: input.file_url,
        poster_url: input.poster_url,
        body: input.body,
        is_published: false,
    });
    revalidatePath("/admin/resources");
    return error ? { error: error.message } : { ok: true };
}

export async function updateResource(id: string, input: ResourceInput) {
    const db = await adminDb();
    const { error } = await db
        .from("resources")
        .update({
            category_id: input.category_id,
            kind: input.kind,
            title: input.title,
            description: input.description || null,
            file_url: input.file_url,
            poster_url: input.poster_url,
            body: input.body,
        })
        .eq("id", id);
    revalidatePath("/admin/resources");
    return error ? { error: error.message } : { ok: true };
}

export async function togglePublishResource(id: string, value: boolean) {
    const db = await adminDb();
    const { error } = await db.from("resources").update({ is_published: value }).eq("id", id);
    revalidatePath("/admin/resources");
    return error ? { error: error.message } : { ok: true };
}

export async function deleteResource(id: string) {
    const db = await adminDb();
    const { error } = await db.from("resources").delete().eq("id", id);
    revalidatePath("/admin/resources");
    return error ? { error: error.message } : { ok: true };
}
