import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopBar } from "@/components/dashboard/TopBar";

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
        <div className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0A] text-white">
            {/* Ambient ember glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,_rgba(241,89,6,0.10),_transparent_70%)] blur-3xl"
            />

            <AppSidebar
                displayName={displayName}
                avatarUrl={avatarUrl}
                level={level}
                title={titleFor(level)}
                isAdmin={isAdmin}
            />

            <div className="relative z-10 lg:pl-64">
                <TopBar displayName={displayName} avatarUrl={avatarUrl} points={points} />
                <main className="mx-auto max-w-6xl px-5 pb-24 pt-20 sm:px-6 lg:px-8 lg:pt-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
