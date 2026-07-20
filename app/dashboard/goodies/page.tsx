import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { Goodies, type UnlockedVM, type ShopVM, type ClaimVM } from "./Goodies";

export const metadata: Metadata = { title: "Goodies" };

export default async function GoodiesPage() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const [{ data: profile }, { data: earned }, { data: gifts }, { data: claims }] =
        await Promise.all([
            supabase.from("profiles").select("total_points").eq("id", user.id).single(),
            supabase
                .from("earned_rewards")
                .select("id, reward_kind, reward_rules(name)")
                .eq("user_id", user.id),
            supabase
                .from("gifts")
                .select("id, title, description, point_cost, stock")
                .eq("is_active", true)
                .not("point_cost", "is", null)
                .order("point_cost"),
            supabase
                .from("gift_claims")
                .select("id, status, gifts(title)")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false }),
        ]);

    const balance = (profile?.total_points as number | undefined) ?? 0;

    const unlocked: UnlockedVM[] = (earned ?? []).map((e) => ({
        id: e.id,
        name: (e.reward_rules as unknown as { name: string } | null)?.name ?? "Reward",
        kind: e.reward_kind,
    }));

    const shop: ShopVM[] = (gifts ?? []).map((g) => ({
        id: g.id,
        title: g.title,
        description: g.description,
        cost: g.point_cost ?? 0,
        stock: g.stock,
    }));

    const claimList: ClaimVM[] = (claims ?? []).map((c) => ({
        id: c.id,
        title: (c.gifts as unknown as { title: string } | null)?.title ?? "Gift",
        status: (c.status as string) ?? "requested",
    }));

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">
                        Rewards
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Claim Goodies</h1>
                    <p className="mt-1 text-sm text-white/50">
                        Redeem unlocked rewards, or spend points in the shop.
                    </p>
                </div>
                <div className="rounded-full border border-[#f15906]/25 bg-[#f15906]/10 px-4 py-2 text-sm font-semibold text-white">
                    {balance.toLocaleString()} pts available
                </div>
            </div>
            <Goodies balance={balance} unlocked={unlocked} shop={shop} claims={claimList} />
        </div>
    );
}
