"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/** Resolve a gift claim. Rejecting/uprooting a point-shop claim refunds the points. */
export async function resolveClaim(
    claimId: string,
    action: "approve" | "ship" | "reject" | "uproot",
    note?: string
) {
    await requireAdmin();
    const admin = createSupabaseAdminClient();

    const { data: claim } = await admin
        .from("gift_claims")
        .select("id, user_id, gift_id, status, gifts(point_cost, stock)")
        .eq("id", claimId)
        .single();
    if (!claim) return { error: "claim not found" };

    const now = new Date().toISOString();

    if (action === "approve" || action === "ship") {
        await admin
            .from("gift_claims")
            .update({ status: action === "approve" ? "approved" : "shipped", resolved_at: now, admin_note: note ?? null })
            .eq("id", claimId);
        revalidatePath("/admin/claims");
        return { ok: true };
    }

    // reject / uproot → mark rejected and refund any spent points (once)
    const gift = claim.gifts as unknown as { point_cost: number | null; stock: number | null } | null;
    if (gift?.point_cost != null && claim.user_id && claim.gift_id) {
        const { data: existingRefund } = await admin
            .from("point_ledger")
            .select("id")
            .eq("user_id", claim.user_id)
            .eq("reason", "claim_refund")
            .eq("ref_id", claim.gift_id)
            .maybeSingle();
        if (!existingRefund) {
            await admin.from("point_ledger").insert({
                user_id: claim.user_id,
                amount: gift.point_cost,
                reason: "claim_refund",
                ref_id: claim.gift_id,
            });
            if (gift.stock != null) {
                await admin.from("gifts").update({ stock: gift.stock + 1 }).eq("id", claim.gift_id);
            }
        }
    }

    await admin
        .from("gift_claims")
        .update({ status: "rejected", resolved_at: now, admin_note: note ?? (action === "uproot" ? "Uprooted by admin" : null) })
        .eq("id", claimId);

    revalidatePath("/admin/claims");
    return { ok: true };
}
