import type { Metadata } from "next";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { RulesManager, type RuleRow, type GiftRow } from "./RulesManager";

export const metadata: Metadata = { title: "Admin · Reward Rules" };
export const dynamic = "force-dynamic";

export default async function AdminRulesPage() {
    const admin = createSupabaseAdminClient();
    const [{ data: rules }, { data: gifts }] = await Promise.all([
        admin.from("reward_rules").select("id, name, rule_type, threshold, reward_kind, is_active").order("created_at"),
        admin.from("gifts").select("id, title, point_cost, stock, is_active").order("created_at"),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">Admin</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Reward Rules</h1>
                <p className="mt-1 text-sm text-white/50">
                    Define how learners earn rewards, and manage the gift catalog. Rules are evaluated automatically.
                </p>
            </div>
            <RulesManager rules={(rules ?? []) as RuleRow[]} gifts={(gifts ?? []) as GiftRow[]} />
        </div>
    );
}
