import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/db";

/**
 * Reconcile a user's points for one item to a desired net, by inserting a single
 * adjusting ledger entry (delta). The sync_points trigger re-sums the whole ledger
 * on insert, so this is idempotent and safe to run on every admin state toggle.
 */
export async function reconcilePoints(
    admin: SupabaseClient<Database>,
    userId: string,
    refId: string,
    adjustReason: string,
    desiredNet: number,
    group: string[]
) {
    const { data } = await admin
        .from("point_ledger")
        .select("amount")
        .eq("user_id", userId)
        .eq("ref_id", refId)
        .in("reason", group);
    const current = (data ?? []).reduce((s, r) => s + (r.amount ?? 0), 0);
    const delta = desiredNet - current;
    if (delta !== 0) {
        await admin.from("point_ledger").insert({ user_id: userId, amount: delta, reason: adjustReason, ref_id: refId });
    }
    return delta;
}
