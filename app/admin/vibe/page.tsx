import type { Metadata } from "next";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { VibeManager, type VibePostRow } from "./VibeManager";

export const metadata: Metadata = { title: "Admin · Ancient Vibe" };
export const dynamic = "force-dynamic";

export default async function AdminVibePage() {
    const admin = createSupabaseAdminClient();
    const { data: posts } = await admin
        .from("vibe_posts")
        .select("id, kind, media_url, poster_url, caption, points_reward, like_count, is_published, created_at")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">Admin</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Ancient Vibe</h1>
                <p className="mt-1 text-sm text-white/50">
                    Publish short posts — videos, images, or text — that appear in the learner reels feed.
                </p>
            </div>
            <VibeManager posts={(posts ?? []) as VibePostRow[]} />
        </div>
    );
}
