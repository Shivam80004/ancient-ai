"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import type { LifeAuditResult } from "@/lib/life-audit/types";

/**
 * Persist a completed Life Audit result and mark the profile onboarded.
 *
 * The result is stored in the `life_audit` jsonb column (see the migration in
 * supabase/migrations). If that column hasn't been applied yet, we fall back to
 * simply marking the user onboarded so the flow is never blocking.
 */
export async function saveLifeAudit(result: LifeAuditResult) {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "unauthorized" };

    const { error } = await supabase
        .from("profiles")
        .update({
            life_audit: result,
            archetype: result.archetype,
            onboarded: true,
        })
        .eq("id", user.id);

    if (error) {
        // Most likely the life_audit / archetype columns don't exist yet.
        // Don't trap the user in onboarding — mark them onboarded and move on.
        console.warn("saveLifeAudit: falling back to onboarded flag —", error.message);
        const { error: fallbackError } = await supabase
            .from("profiles")
            .update({ onboarded: true })
            .eq("id", user.id);
        if (fallbackError) return { error: fallbackError.message };
    }

    revalidatePath("/dashboard");
    return { ok: true };
}

/** Let the user skip for now — marks onboarded so they aren't nagged. */
export async function skipLifeAudit() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "unauthorized" };
    await supabase.from("profiles").update({ onboarded: true }).eq("id", user.id);
    revalidatePath("/dashboard");
    return { ok: true };
}
