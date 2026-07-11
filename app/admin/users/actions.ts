"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

/** Promote/demote a user. Admin-only; RLS "profiles admin all" permits the update. */
export async function setUserRole(userId: string, role: "user" | "admin") {
    await requireAdmin();
    const db = await createSupabaseServerClient();
    const { error } = await db.from("profiles").update({ role }).eq("id", userId);
    revalidatePath("/admin/users");
    return error ? { error: error.message } : { ok: true };
}
