import type { Metadata } from "next";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ClaimsQueue, type ClaimRow } from "./ClaimsQueue";

export const metadata: Metadata = { title: "Admin · Claims" };
export const dynamic = "force-dynamic";

export default async function AdminClaimsPage() {
    const admin = createSupabaseAdminClient();

    const { data: claims } = await admin
        .from("gift_claims")
        .select("id, status, created_at, gifts(title, point_cost), profiles(full_name)")
        .order("created_at", { ascending: false });

    const rows: ClaimRow[] = (claims ?? []).map((c) => ({
        id: c.id,
        gift: (c.gifts as unknown as { title: string } | null)?.title ?? "Gift",
        cost: (c.gifts as unknown as { point_cost: number | null } | null)?.point_cost ?? null,
        user: (c.profiles as unknown as { full_name: string | null } | null)?.full_name ?? "Learner",
        status: (c.status as string) ?? "requested",
        when: c.created_at ? new Date(c.created_at).toLocaleDateString() : "",
    }));

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">Admin</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Gift Claims</h1>
                <p className="mt-1 text-sm text-white/50">Approve, ship, reject, or uproot claims. Point-shop refunds are automatic.</p>
            </div>
            <ClaimsQueue claims={rows} />
        </div>
    );
}
