import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { VibeFeed, type VibePost } from "./VibeFeed";

export const metadata: Metadata = { title: "Ancient Vibe" };
export const dynamic = "force-dynamic";

export default async function VibePage() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // RLS returns only published posts.
    const { data: posts } = await supabase
        .from("vibe_posts")
        .select("id, kind, media_url, poster_url, caption, points_reward, like_count")
        .order("order_index")
        .order("created_at", { ascending: false });

    const { data: likes } = await supabase
        .from("vibe_likes")
        .select("post_id")
        .eq("user_id", user.id);
    const likedIds = new Set((likes ?? []).map((l) => l.post_id as string));

    const vm: VibePost[] = (posts ?? []).map((p) => ({
        id: p.id,
        kind: p.kind as VibePost["kind"],
        media_url: p.media_url,
        poster_url: p.poster_url,
        caption: p.caption,
        like_count: p.like_count ?? 0,
        liked: likedIds.has(p.id),
    }));

    return <VibeFeed posts={vm} />;
}
