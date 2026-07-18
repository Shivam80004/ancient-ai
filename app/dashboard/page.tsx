import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
    Sparkles,
    Trophy,
    GraduationCap,
    Flame,
    ArrowRight,
    BookOpen,
    Gift,
    Plus,
} from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { CountUp } from "@/components/dashboard/CountUp";
import { ProgressRing } from "@/components/dashboard/ProgressRing";

export const metadata: Metadata = { title: "Dashboard" };

const XP_PER_LEVEL = 1000;

export default async function DashboardHome() {
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
        (profile?.full_name as string | undefined) ?? user.email?.split("@")[0] ?? "Seeker";
    const points = (profile?.total_points as number | undefined) ?? 0;
    const xp = (profile?.xp as number | undefined) ?? 0;
    const level = Math.floor(xp / XP_PER_LEVEL) + 1;
    const levelPct = Math.round(((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100);
    const isAdmin = profile?.role === "admin";

    // Rank (from the public leaderboard RPC; admins are excluded → null)
    const { data: lb } = await supabase.rpc("get_leaderboard");
    const rank =
        (Array.isArray(lb) ? lb.find((r: { id: string }) => r.id === user.id) : null)?.rank ?? null;

    // Enrollments (+ course) for resume card + counts
    const { data: enrollments } = await supabase
        .from("enrollments")
        .select("*, course:courses(*)")
        .eq("user_id", user.id)
        .order("enrolled_at", { ascending: false });
    const list = enrollments ?? [];
    const coursesCompleted = list.filter((e: { status: string }) => e.status === "completed").length;
    const resume = list.find((e: { status: string }) => e.status === "in_progress") ?? null;

    // Streak
    const { data: streak } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
    const streakDays = (streak?.current_streak as number | undefined) ?? 0;

    // Recent activity
    const { data: ledger } = await supabase
        .from("point_ledger")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
    const activity = ledger ?? [];

    const stats = [
        { label: "Total Points", value: points, display: <CountUp value={points} />, icon: Sparkles },
        { label: "Rank", value: rank, display: rank ? `#${rank}` : "—", icon: Trophy },
        { label: "Courses Completed", value: coursesCompleted, display: <CountUp value={coursesCompleted} />, icon: GraduationCap },
        { label: "Day Streak", value: streakDays, display: <CountUp value={streakDays} />, icon: Flame },
    ];

    return (
        <div className="space-y-6">
            {/* Hero */}
            <GlassCard className="relative overflow-hidden p-8" bg_grad="linear-gradient(221deg, rgba(246, 32, 3, 0) -11.86%, #bc5307 -5.96%, #36180e 5.45%, #000000 30.99%, rgba(246, 32, 3, 0) 62.85%, #9d1300 101.39%, #000000 103.82%)">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,_rgba(241,89,6,0.20),_transparent_70%)] blur-2xl"
                />
                <div className="relative z-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">
                            Ancient AI University
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold text-white">
                            Welcome back, {displayName}
                        </h1>
                        <p className="mt-2 max-w-md text-sm text-white/50">
                            A better human experience for the mind, body, and soul — one lesson at a time.
                        </p>
                    </div>
                    <ProgressRing value={levelPct} size={128} stroke={12}>
                        <div className="text-center">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Level</p>
                            <p className="text-3xl font-bold text-white">{level}</p>
                            <p className="text-[10px] font-medium text-[#f15906]">{levelPct}%</p>
                        </div>
                    </ProgressRing>
                </div>
            </GlassCard>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {stats.map((s) => {
                    const Icon = s.icon;
                    return (
                        <GlassCard key={s.label} hover className="p-5 bg-[radial-gradient(circle,_rgba(241,89,6,0.20),_transparent_70%)]" >
                            <div className="flex items-center gap-0">
                                <span className="flex size-10 items-center justify-center rounded-2xl bg-[#f15906]/0 text-[#f15906]">
                                    <Icon className="size-5" />
                                </span>
                                <p className="text-xs uppercase tracking-[0.15em] text-white/85">{s.label}</p>
                            </div>
                            <p className="mt-4 text-3xl font-semibold text-white">{s.display}</p>
                        </GlassCard>
                    );
                })}
            </div>

            {/* Resume + Next reward */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <GlassCard hover className="p-8 lg:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">
                        Resume learning
                    </p>
                    {resume ? (
                        <div className="mt-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                {resume.course?.thumbnail_url && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={resume.course.thumbnail_url}
                                        alt=""
                                        className="hidden h-16 w-24 shrink-0 rounded-xl object-cover sm:block"
                                    />
                                )}
                                <div>
                                    <h2 className="text-2xl font-semibold text-white">
                                        {resume.course?.title ?? "Your course"}
                                    </h2>
                                    <p className="mt-1 text-sm text-white/50">Pick up where you left off.</p>
                                </div>
                            </div>
                            <Link
                                href={`/dashboard/courses/${resume.course_id}`}
                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 transition hover:brightness-110"
                            >
                                Continue <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 py-10 text-center">
                            <BookOpen className="size-8 text-white/30" />
                            <p className="text-sm text-white/60">You haven&apos;t started a course yet.</p>
                            <Link
                                href={isAdmin ? "/admin/courses" : "/dashboard/courses"}
                                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.12]"
                            >
                                {isAdmin ? (
                                    <>
                                        <Plus className="size-4" /> Add courses
                                    </>
                                ) : (
                                    <>Browse courses <ArrowRight className="size-4" /></>
                                )}
                            </Link>
                        </div>
                    )}
                </GlassCard>

                <GlassCard hover className="p-8">
                    <p className="text-xs text-center font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">
                        Next reward
                    </p>
                    <div className="mt-6 flex flex-col items-center justify-center gap-3 text-center">
                        <span className="flex size-12 items-center justify-center rounded-2xl bg-[#f15906]/12 text-[#f15906]">
                            <Gift className="size-6" />
                        </span>
                        <p className="text-sm text-white/60">
                            {isAdmin ? "No reward rules configured yet." : "No rewards available yet — keep learning!"}
                        </p>
                        {isAdmin && (
                            <Link
                                href="/admin/rules"
                                className="text-sm font-semibold text-[#f15906] hover:underline"
                            >
                                Configure rewards →
                            </Link>
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* Recent activity */}
            <GlassCard className="p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">
                    Recent activity
                </p>
                {activity.length > 0 ? (
                    <ul className="mt-5 space-y-3">
                        {activity.map((a: { id: string; reason: string; amount: number; created_at: string | null }) => (
                            <li
                                key={a.id}
                                className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3"
                            >
                                <span className="text-sm text-white/80 capitalize">
                                    {a.reason.replace(/_/g, " ")}
                                </span>
                                <span className={a.amount >= 0 ? "text-sm font-semibold text-[#f15906]" : "text-sm font-semibold text-white/50"}>
                                    {a.amount >= 0 ? "+" : ""}
                                    {a.amount}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-6 text-sm text-white/50">
                        No activity yet. Complete a lesson or task to start earning points.
                    </p>
                )}
            </GlassCard>
        </div>
    );
}
