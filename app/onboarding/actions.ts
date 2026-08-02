"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type OnboardingData = {
    occupation: string;
    occupation_detail: string;
    organization: string;
    domain: string;
    interests: string[];
    experience_level: string;
    goals: string;
};

export async function saveOnboarding(data: OnboardingData) {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "unauthorized" };

    const { error } = await supabase
        .from("profiles")
        .update({
            occupation: data.occupation || null,
            occupation_detail: data.occupation_detail || null,
            organization: data.organization || null,
            domain: data.domain || null,
            interests: data.interests ?? [],
            experience_level: data.experience_level || null,
            goals: data.goals || null,
            onboarded: true,
        })
        .eq("id", user.id);
    if (error) return { error: error.message };

    revalidatePath("/dashboard");
    return { ok: true };
}

/** Let the user skip for now — marks onboarded so they aren't nagged. */
export async function skipOnboarding() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "unauthorized" };
    await supabase.from("profiles").update({ onboarded: true }).eq("id", user.id);
    revalidatePath("/dashboard");
    return { ok: true };
}
