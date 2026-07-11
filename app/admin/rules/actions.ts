"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

async function adminDb() {
    await requireAdmin();
    return createSupabaseServerClient();
}

export async function createRule(input: {
    name: string;
    rule_type: string;
    threshold: number;
    reward_kind: string;
}) {
    const db = await adminDb();
    const { error } = await db.from("reward_rules").insert({
        name: input.name,
        rule_type: input.rule_type,
        threshold: input.threshold,
        reward_kind: input.reward_kind,
        is_active: true,
    });
    revalidatePath("/admin/rules");
    return error ? { error: error.message } : { ok: true };
}

export async function createGift(input: {
    title: string;
    description: string;
    point_cost: number | null;
    stock: number | null;
}) {
    const db = await adminDb();
    const { error } = await db.from("gifts").insert({
        title: input.title,
        description: input.description,
        point_cost: input.point_cost,
        stock: input.stock,
        is_active: true,
    });
    revalidatePath("/admin/rules");
    return error ? { error: error.message } : { ok: true };
}

export async function toggleActive(table: "reward_rules" | "gifts", id: string, value: boolean) {
    const db = await adminDb();
    const { error } = await db.from(table).update({ is_active: value }).eq("id", id);
    revalidatePath("/admin/rules");
    return error ? { error: error.message } : { ok: true };
}
