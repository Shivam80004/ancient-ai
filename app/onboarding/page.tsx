import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { LifeAuditQuiz } from "./LifeAuditQuiz";

export const metadata: Metadata = { title: "Your Life Audit" };
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (profile?.onboarded) redirect("/dashboard");

    const displayName =
        (profile?.full_name as string | undefined) ?? user.email?.split("@")[0] ?? "there";

    return <LifeAuditQuiz displayName={displayName} />;
}
