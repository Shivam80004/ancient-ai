"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { reconcilePoints } from "@/lib/rewards/reconcile";

export type ClaimStatus = "requested" | "approved" | "shipped" | "rejected";
const CHARGED = new Set<ClaimStatus>(["requested", "approved", "shipped"]);
const POINT_REASONS = ["gift_claim", "claim_refund", "claim_recharge", "claim_adjust"];

/**
 * Move a claim to any status (forward or backward). For point-shop gifts this keeps
 * the points ledger and stock consistent: a "charged" state (requested/approved/shipped)
 * nets −point_cost; a rejected claim nets 0 (refunded). Fully reversible.
 */
export async function setClaimStatus(claimId: string, target: ClaimStatus, note?: string) {
    await requireAdmin();
    const admin = createSupabaseAdminClient();

    const { data: claim } = await admin
        .from("gift_claims")
        .select("id, user_id, gift_id, status, admin_note, gifts(point_cost, stock)")
        .eq("id", claimId)
        .single();
    if (!claim) return { error: "claim not found" };

    const prev = (claim.status ?? "requested") as ClaimStatus;
    const gift = claim.gifts as unknown as { point_cost: number | null; stock: number | null } | null;
    const now = new Date().toISOString();

    await admin
        .from("gift_claims")
        .update({ status: target, resolved_at: target === "requested" ? null : now, admin_note: note ?? claim.admin_note ?? null })
        .eq("id", claimId);

    if (gift?.point_cost != null && claim.user_id && claim.gift_id) {
        const prevCharged = CHARGED.has(prev);
        const targetCharged = CHARGED.has(target);

        // Adjust stock only on a real charged <-> refunded transition.
        if (gift.stock != null) {
            if (prevCharged && !targetCharged) {
                await admin.from("gifts").update({ stock: gift.stock + 1 }).eq("id", claim.gift_id);
            } else if (!prevCharged && targetCharged) {
                await admin.from("gifts").update({ stock: Math.max(0, gift.stock - 1) }).eq("id", claim.gift_id);
            }
        }

        await reconcilePoints(
            admin,
            claim.user_id,
            claim.gift_id,
            "claim_adjust",
            targetCharged ? -gift.point_cost : 0,
            POINT_REASONS
        );
    }

    revalidatePath("/admin/claims");
    return { ok: true };
}
