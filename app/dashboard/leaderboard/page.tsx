import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { Leaderboard, type Row } from "./Leaderboard";

export const metadata: Metadata = { title: "Leaderboard" };

export default async function LeaderboardPage() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: settings } = await supabase
        .from("settings")
        .select("season_start, season_name")
        .eq("id", 1)
        .maybeSingle();
    const seasonStart = settings?.season_start ?? new Date(0).toISOString();
    const seasonName = settings?.season_name ?? "This season";

    const { data: allTimeRaw } = await supabase.rpc("get_leaderboard");
    const { data: seasonRaw } = await supabase.rpc("get_season_leaderboard", { since: seasonStart });

    const allTime: Row[] = (allTimeRaw ?? []).map((r: { id: string; full_name: string | null; avatar_url: string | null; total_points: number; rank: number }) => ({
        id: r.id,
        name: r.full_name ?? "Learner",
        avatar: r.avatar_url,
        points: r.total_points ?? 0,
        rank: Number(r.rank),
    }));
    const season: Row[] = (seasonRaw ?? []).map((r: { id: string; full_name: string | null; avatar_url: string | null; points: number; rank: number }) => ({
        id: r.id,
        name: r.full_name ?? "Learner",
        avatar: r.avatar_url,
        points: Number(r.points) ?? 0,
        rank: Number(r.rank),
    }));

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">
                    Rankings
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Leaderboard</h1>
                <p className="mt-1 text-sm text-white/50">
                    Ranked by points earned. Admins are not listed.
                </p>
            </div>
            <Leaderboard allTime={allTime} season={season} seasonName={seasonName} userId={user.id} />
        </div>
    );
}
