"use client";

import { useState } from "react";
import { Trophy, Crown } from "lucide-react";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { cn } from "@/lib/utils";

export type Row = { id: string; name: string; avatar: string | null; points: number; rank: number };

function Avatar({ name, avatar, size = "size-9" }: { name: string; avatar: string | null; size?: string }) {
    return avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatar} alt={name} className={cn(size, "rounded-full border border-white/15 object-cover")} />
    ) : (
        <span className={cn(size, "flex items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-red-600 text-sm font-bold text-white")}>
            {name.charAt(0).toUpperCase()}
        </span>
    );
}

export function Leaderboard({
    allTime,
    season,
    seasonName,
    userId,
}: {
    allTime: Row[];
    season: Row[];
    seasonName: string;
    userId: string;
}) {
    const [tab, setTab] = useState<"all" | "season">("all");
    const rows = tab === "all" ? allTime : season;
    const podium = rows.slice(0, 3);
    const rest = rows.slice(3);
    const you = rows.find((r) => r.id === userId);
    const youInView = you && you.rank <= 3 + rest.length;

    const medal = ["from-amber-400 to-yellow-600", "from-slate-300 to-slate-500", "from-amber-700 to-orange-900"];

    return (
        <div className="space-y-6">
            <div className="inline-flex rounded-full border border-white/[0.08] bg-white/[0.04] p-1">
                {([["all", "All-time"], ["season", seasonName]] as const).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={cn(
                            "rounded-full px-4 py-2 text-sm font-medium transition",
                            tab === key ? "bg-gradient-to-r from-orange-600 to-red-600 text-white" : "text-white/50 hover:text-white/80"
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {rows.length === 0 ? (
                <GlassCard className="p-12 text-center">
                    <Trophy className="mx-auto size-8 text-white/30" />
                    <p className="mt-3 text-sm text-white/60">No ranked learners yet.</p>
                </GlassCard>
            ) : (
                <>
                    {/* Podium */}
                    {podium.length > 0 && (
                        <div className="grid md:grid-cols-3 grid-cols-2 gap-3 sm:gap-5">
                            {podium.map((r, i) => (
                                <GlassCard
                                    key={r.id}
                                    hover
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-5 text-center",
                                        i === 0 && "sm:-translate-y-3",
                                        r.id === userId && "ring-1 ring-[#f15906]/50"
                                    )}
                                >
                                    <span className={cn("flex size-8 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white", medal[i])}>
                                        {i === 0 ? <Crown className="size-4" /> : r.rank}
                                    </span>
                                    <Avatar name={r.name} avatar={r.avatar} size="size-14" />
                                    <p className="truncate text-sm font-semibold text-white w-full">{r.name}</p>
                                    <p className="text-xs font-semibold text-[#f15906]">{r.points.toLocaleString()} pts</p>
                                </GlassCard>
                            ))}
                        </div>
                    )}

                    {/* Table */}
                    <GlassCard className="divide-y divide-white/[0.06] p-2">
                        {rest.map((r) => (
                            <Line key={r.id} r={r} me={r.id === userId} />
                        ))}
                        {rest.length === 0 && <p className="p-4 text-center text-sm text-white/40">That&apos;s everyone for now.</p>}
                    </GlassCard>

                    {/* Pinned "you" if outside the visible list */}
                    {you && !youInView && (
                        <GlassCard className="border-[#f15906]/30 p-2">
                            <Line r={you} me />
                        </GlassCard>
                    )}
                </>
            )}
        </div>
    );
}

function Line({ r, me }: { r: Row; me?: boolean }) {
    return (
        <div className={cn("flex items-center gap-3 rounded-2xl px-4 py-3", me && "bg-[#f15906]/5")}>
            <span className="w-8 text-center text-sm font-semibold text-white/50">#{r.rank}</span>
            <Avatar name={r.name} avatar={r.avatar} />
            <span className={cn("flex-1 truncate text-sm", me ? "font-semibold text-[#f15906]" : "text-white/85")}>
                {r.name} {me && <span className="text-xs text-white/40">(You)</span>}
            </span>
            <span className="text-sm font-semibold text-white">{r.points.toLocaleString()}</span>
        </div>
    );
}
