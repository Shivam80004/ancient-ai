import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Bump the user's daily-practice streak. Call on any point-earning activity. */
export async function touchStreak(admin: SupabaseClient, userId: string) {
    const today = new Date();
    const toKey = (d: Date) => d.toISOString().slice(0, 10);
    const todayKey = toKey(today);
    const yesterdayKey = toKey(new Date(today.getTime() - 86_400_000));

    const { data: row } = await admin
        .from("streaks")
        .select("current_streak, longest_streak, last_active_date")
        .eq("user_id", userId)
        .maybeSingle();

    if (row?.last_active_date === todayKey) return; // already counted today

    const current = row?.last_active_date === yesterdayKey ? (row.current_streak ?? 0) + 1 : 1;
    const longest = Math.max(row?.longest_streak ?? 0, current);

    await admin.from("streaks").upsert(
        { user_id: userId, current_streak: current, longest_streak: longest, last_active_date: todayKey },
        { onConflict: "user_id" }
    );
}
