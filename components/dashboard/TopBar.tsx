"use client";

import { Search, Sparkles } from "lucide-react";
import { CountUp } from "./CountUp";

/** Frosted top bar (desktop): ⌘K search, animated points pill, avatar. */
export function TopBar({
    displayName,
    avatarUrl,
    points,
}: {
    displayName: string;
    avatarUrl?: string | null;
    points: number;
}) {
    return (
        <header className="sticky top-0 z-30 hidden items-center justify-between gap-4 border-b border-white/[0.08] bg-[#0A0A0A]/70 px-6 py-3 backdrop-blur-xl lg:flex">
            {/* Search (⌘K placeholder — wired in Phase 6) */}
            <button
                type="button"
                className="group flex w-72 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-white/40 transition hover:border-white/[0.14]"
            >
                <Search className="size-4" />
                <span className="flex-1 text-left">Search…</span>
                <kbd className="rounded border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-white/50">
                    ⌘K
                </kbd>
            </button>

            <div className="flex items-center gap-4">
                {/* Points pill */}
                <div className="flex items-center gap-2 rounded-full border border-[#f15906]/25 bg-[#f15906]/10 px-4 py-1.5">
                    <Sparkles className="size-4 text-[#f15906]" />
                    <CountUp value={points} className="text-sm font-semibold text-white" />
                    <span className="text-xs text-white/50">pts</span>
                </div>

                {/* Avatar */}
                {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={avatarUrl}
                        alt={displayName}
                        className="size-9 rounded-full border border-white/15 object-cover"
                    />
                ) : (
                    <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-red-600 text-sm font-bold text-white">
                        {displayName.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>
        </header>
    );
}
