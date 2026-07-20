"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

async function adminDb() {
    await requireAdmin();
    return createSupabaseServerClient();
}

export type VibeInput = {
    kind: "video" | "image" | "text";
    media_url: string | null;
    poster_url: string | null;
    caption: string;
    points_reward: number;
};

export async function createVibePost(input: VibeInput) {
    const db = await adminDb();
    const { error } = await db.from("vibe_posts").insert({
        kind: input.kind,
        media_url: input.media_url,
        poster_url: input.poster_url,
        caption: input.caption,
        points_reward: input.points_reward,
        is_published: false,
    });
    revalidatePath("/admin/vibe");
    return error ? { error: error.message } : { ok: true };
}

export async function updateVibePost(id: string, input: VibeInput) {
    const db = await adminDb();
    const { error } = await db
        .from("vibe_posts")
        .update({
            kind: input.kind,
            media_url: input.media_url,
            poster_url: input.poster_url,
            caption: input.caption,
            points_reward: input.points_reward,
        })
        .eq("id", id);
    revalidatePath("/admin/vibe");
    return error ? { error: error.message } : { ok: true };
}

export async function togglePublishVibe(id: string, value: boolean) {
    const db = await adminDb();
    const { error } = await db.from("vibe_posts").update({ is_published: value }).eq("id", id);
    revalidatePath("/admin/vibe");
    return error ? { error: error.message } : { ok: true };
}

export async function deleteVibePost(id: string) {
    const db = await adminDb();
    const { error } = await db.from("vibe_posts").delete().eq("id", id);
    revalidatePath("/admin/vibe");
    return error ? { error: error.message } : { ok: true };
}
