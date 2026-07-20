import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const Body = z.object({ giftId: z.string().uuid() });

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const parsed = Body.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "bad request" }, { status: 400 });
    const { giftId } = parsed.data;

    const admin = createSupabaseAdminClient();

    const { data: gift } = await admin
        .from("gifts")
        .select("id, title, point_cost, stock, is_active")
        .eq("id", giftId)
        .maybeSingle();
    if (!gift || !gift.is_active) return NextResponse.json({ error: "gift unavailable" }, { status: 404 });

    const { data: profile } = await admin
        .from("profiles")
        .select("total_points, shipping_info")
        .eq("id", user.id)
        .single();
    const balance = profile?.total_points ?? 0;

    // Point-shop gift → verify balance + stock, then deduct
    if (gift.point_cost != null) {
        if (balance < gift.point_cost)
            return NextResponse.json({ error: "Not enough points." }, { status: 400 });
        if (gift.stock != null && gift.stock <= 0)
            return NextResponse.json({ error: "Out of stock." }, { status: 400 });

        const { data: claim, error } = await admin
            .from("gift_claims")
            .insert({ user_id: user.id, gift_id: giftId, status: "requested", shipping_info: profile?.shipping_info ?? null })
            .select("id")
            .single();
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });

        await admin.from("point_ledger").insert({
            user_id: user.id,
            amount: -gift.point_cost,
            reason: "gift_claim",
            ref_id: giftId,
        });
        if (gift.stock != null) {
            await admin.from("gifts").update({ stock: gift.stock - 1 }).eq("id", giftId);
        }
        return NextResponse.json({ ok: true, claimId: claim.id, spent: gift.point_cost });
    }

    // Benchmark/free gift → require an earned reward that references it
    const { data: earned } = await admin
        .from("earned_rewards")
        .select("id")
        .eq("user_id", user.id)
        .eq("reward_ref", giftId)
        .maybeSingle();
    if (!earned) return NextResponse.json({ error: "Not unlocked yet." }, { status: 403 });

    const { data: claim, error } = await admin
        .from("gift_claims")
        .insert({ user_id: user.id, gift_id: giftId, status: "requested", shipping_info: profile?.shipping_info ?? null })
        .select("id")
        .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true, claimId: claim.id, spent: 0 });
}
