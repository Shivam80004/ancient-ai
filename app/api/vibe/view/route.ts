import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { evaluateRewards } from "@/lib/rewards/engine";

const Body = z.object({ postId: z.string().uuid() });

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const parsed = Body.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "bad request" }, { status: 400 });
    const { postId } = parsed.data;

    const admin = createSupabaseAdminClient(); // service-role: authoritative writes

    // Already watched? no-op (idempotent).
    const { data: existingView } = await admin
        .from("vibe_views")
        .select("post_id")
        .eq("user_id", user.id)
        .eq("post_id", postId)
        .maybeSingle();
    if (existingView) return NextResponse.json({ awarded: 0, already: true });

    // Post must exist + be published.
    const { data: post } = await admin
        .from("vibe_posts")
        .select("points_reward, is_published")
        .eq("id", postId)
        .maybeSingle();
    if (!post || !post.is_published) return NextResponse.json({ error: "not found" }, { status: 404 });

    await admin
        .from("vibe_views")
        .upsert({ user_id: user.id, post_id: postId }, { onConflict: "user_id,post_id", ignoreDuplicates: true });

    let awarded = 0;
    const reward = post.points_reward ?? 0;
    if (reward > 0) {
        const { data: existingLedger } = await admin
            .from("point_ledger")
            .select("id")
            .eq("user_id", user.id)
            .eq("reason", "vibe_view")
            .eq("ref_id", postId)
            .maybeSingle();
        if (!existingLedger) {
            await admin.from("point_ledger").insert({ user_id: user.id, amount: reward, reason: "vibe_view", ref_id: postId });
            awarded = reward;
        }
    }

    const newRewards = await evaluateRewards(user.id);
    return NextResponse.json({ awarded, newRewards });
}
