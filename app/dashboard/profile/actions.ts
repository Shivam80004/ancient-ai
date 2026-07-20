"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type ShippingInfo = {
    name?: string;
    line1?: string;
    city?: string;
    postal?: string;
    country?: string;
};

export async function updateShippingAction(info: ShippingInfo) {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "unauthorized" };

    const { error } = await supabase
        .from("profiles")
        .update({ shipping_info: info })
        .eq("id", user.id);
    if (error) return { error: error.message };

    revalidatePath("/dashboard/profile");
    return { ok: true };
}
