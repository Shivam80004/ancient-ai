import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const XP_PER_LEVEL = 1000;

function titleFor(level: number) {
    if (level >= 10) return "Sage";
    if (level >= 6) return "Scholar";
    if (level >= 3) return "Adept";
    return "Novice";
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
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

    const displayName =
        (profile?.full_name as string | undefined) ??
        user.email?.split("@")[0] ??
        "Seeker";
    const avatarUrl =
        (profile?.avatar_url as string | undefined) ??
        (user.user_metadata?.avatar_url as string | undefined);
    const points = (profile?.total_points as number | undefined) ?? 0;
    const xp = (profile?.xp as number | undefined) ?? 0;
    const level = Math.floor(xp / XP_PER_LEVEL) + 1;
    const isAdmin = profile?.role === "admin";

    // First-time learners complete the onboarding wizard before entering the app.
    if (profile && !profile.onboarded && !isAdmin) redirect("/onboarding");

    return (
        <DashboardShell
            displayName={displayName}
            avatarUrl={avatarUrl}
            level={level}
            title={titleFor(level)}
            isAdmin={isAdmin}
            points={points}
        >
            {children}
        </DashboardShell>
    );
}
