"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

/** Toggle the current user's like on a post. `liked` = the state BEFORE the click. */
export async function toggleLike(postId: string, liked: boolean) {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "unauthorized" };

    if (liked) {
        await supabase.from("vibe_likes").delete().eq("user_id", user.id).eq("post_id", postId);
    } else {
        await supabase
            .from("vibe_likes")
            .upsert({ user_id: user.id, post_id: postId }, { onConflict: "user_id,post_id", ignoreDuplicates: true });
    }
    return { ok: true, liked: !liked };
}
