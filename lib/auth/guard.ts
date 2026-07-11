import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import type { Tables } from "@/types/db";

export type Profile = Tables<"profiles">;

/** Require a signed-in user, or redirect to /login. Returns the auth user. */
export async function requireUser() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");
    return user;
}

/** Fetch the current user's profile row (or null if signed out). */
export async function getProfile(): Promise<Profile | null> {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
    return (data as Profile) ?? null;
}

/**
 * Require an admin. Redirects to /login if signed out, or /dashboard if the
 * signed-in user is not an admin. Server-side role check — never trust a client flag.
 */
export async function requireAdmin() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile || (profile as Profile).role !== "admin") redirect("/dashboard");
    return { user, profile: profile as Profile };
}
