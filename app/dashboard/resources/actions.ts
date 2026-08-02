"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

async function me() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    return { supabase, user };
}

/** Toggle a like. `liked` = state BEFORE the click. */
export async function toggleResourceLike(resourceId: string, liked: boolean) {
    const { supabase, user } = await me();
    if (!user) return { error: "unauthorized" };
    if (liked) {
        await supabase.from("resource_likes").delete().eq("user_id", user.id).eq("resource_id", resourceId);
    } else {
        await supabase.from("resource_likes").upsert({ user_id: user.id, resource_id: resourceId }, { onConflict: "user_id,resource_id", ignoreDuplicates: true });
    }
    return { ok: true, liked: !liked };
}

/** Toggle a save/bookmark. `saved` = state BEFORE the click. */
export async function toggleResourceSave(resourceId: string, saved: boolean) {
    const { supabase, user } = await me();
    if (!user) return { error: "unauthorized" };
    if (saved) {
        await supabase.from("resource_saves").delete().eq("user_id", user.id).eq("resource_id", resourceId);
    } else {
        await supabase.from("resource_saves").upsert({ user_id: user.id, resource_id: resourceId }, { onConflict: "user_id,resource_id", ignoreDuplicates: true });
    }
    return { ok: true, saved: !saved };
}
