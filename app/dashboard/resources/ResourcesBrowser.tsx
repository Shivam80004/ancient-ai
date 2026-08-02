"use client";

import { useState } from "react";
import { Heart, Bookmark, FileText, ImageIcon, Film, Quote, Link2, Paperclip, Download, ExternalLink, Play, BookOpen } from "lucide-react";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { cn } from "@/lib/utils";
import { toggleResourceLike, toggleResourceSave } from "./actions";

export type BrowserCategory = { id: string; name: string };
export type BrowserResource = {
    id: string;
    category_id: string | null;
    kind: "pdf" | "image" | "video" | "quote" | "link" | "file";
    title: string;
    description: string | null;
    file_url: string | null;
    poster_url: string | null;
    body: string | null;
    like_count: number;
    liked: boolean;
    saved: boolean;
};

const KIND_ICON = { pdf: FileText, image: ImageIcon, video: Film, quote: Quote, link: Link2, file: Paperclip };
const ACTION: Record<string, { label: string; icon: typeof Download }> = {
    pdf: { label: "Download", icon: Download },
    file: { label: "Download", icon: Download },
    image: { label: "View", icon: ExternalLink },
    video: { label: "Play", icon: Play },
    link: { label: "Open", icon: ExternalLink },
};

export function ResourcesBrowser({ categories, resources }: { categories: BrowserCategory[]; resources: BrowserResource[] }) {
    const [filter, setFilter] = useState<string>("all");
    const [state, setState] = useState<Record<string, { liked: boolean; saved: boolean; count: number }>>(
        Object.fromEntries(resources.map((r) => [r.id, { liked: r.liked, saved: r.saved, count: r.like_count }]))
    );

    const rows = resources.filter((r) => {
        const s = state[r.id];
        if (filter === "all") return true;
        if (filter === "saved") return s?.saved;
        return r.category_id === filter;
    });

    function like(r: BrowserResource) {
        const cur = state[r.id];
        const nextLiked = !cur.liked;
        setState((s) => ({ ...s, [r.id]: { ...cur, liked: nextLiked, count: cur.count + (nextLiked ? 1 : -1) } }));
        toggleResourceLike(r.id, cur.liked).catch(() => setState((s) => ({ ...s, [r.id]: cur })));
    }
    function save(r: BrowserResource) {
        const cur = state[r.id];
        const nextSaved = !cur.saved;
        setState((s) => ({ ...s, [r.id]: { ...cur, saved: nextSaved } }));
        toggleResourceSave(r.id, cur.saved).catch(() => setState((s) => ({ ...s, [r.id]: cur })));
    }

    const pills = [
        { id: "all", name: "All" },
        ...categories,
        { id: "saved", name: "Saved" },
    ];

    return (
        <div className="space-y-6">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
                {pills.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => setFilter(p.id)}
                        className={cn(
                            "rounded-full border px-4 py-2 text-sm font-medium transition",
                            filter === p.id ? "border-transparent bg-gradient-to-r from-orange-600 to-red-600 text-white" : "border-white/10 bg-white/[0.04] text-white/60 hover:text-white"
                        )}
                    >
                        {p.name}
                    </button>
                ))}
            </div>

            {rows.length === 0 ? (
                <GlassCard className="p-12 text-center">
                    <BookOpen className="mx-auto size-8 text-white/30" />
                    <p className="mt-3 text-sm text-white/60">{filter === "saved" ? "You haven't saved anything yet." : "No resources here yet."}</p>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {rows.map((r) => {
                        const st = state[r.id];
                        const Icon = KIND_ICON[r.kind] ?? FileText;
                        const action = ACTION[r.kind];
                        return (
                            <GlassCard key={r.id} hover className="flex flex-col overflow-hidden">
                                {/* Media / quote header */}
                                {r.kind === "quote" ? (
                                    <div className="flex min-h-[200px] items-center justify-center bg-gradient-to-br from-[#3a1608] via-[#1a0d07] to-black p-6">
                                        <p className="text-center text-lg font-medium leading-snug text-white" style={{ fontFamily: "var(--font-oswald)" }}>
                                            “{r.body}”
                                        </p>
                                    </div>
                                ) : r.poster_url || (r.kind === "image" && r.file_url) ? (
                                    <div className="relative aspect-video w-full overflow-hidden border-b border-white/[0.06]">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={r.poster_url ?? r.file_url ?? ""} alt={r.title} className="h-full w-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="flex aspect-video w-full items-center justify-center border-b border-white/[0.06] bg-gradient-to-br from-[#221b17] to-[#0d0a09]">
                                        <Icon className="size-8 text-white/20" />
                                    </div>
                                )}

                                <div className="flex flex-1 flex-col p-5">
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-0.5 text-[11px] font-medium capitalize text-white/60">
                                            <Icon className="size-3" /> {r.kind}
                                        </span>
                                    </div>
                                    <h3 className="mt-2 text-base font-semibold text-white">{r.title}</h3>
                                    {r.description && <p className="mt-1 line-clamp-2 flex-1 text-sm text-white/50">{r.description}</p>}

                                    <div className="mt-4 flex items-center justify-between">
                                        {/* Primary action */}
                                        {action && r.file_url ? (
                                            <a
                                                href={r.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 transition hover:brightness-110"
                                            >
                                                <action.icon className="size-4" /> {action.label}
                                            </a>
                                        ) : (
                                            <span />
                                        )}

                                        {/* Like + save */}
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => like(r)} aria-label="Like" className="inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-sm text-white/60 transition hover:text-white">
                                                <Heart className={cn("size-4", st.liked && "fill-[#f15906] text-[#f15906]")} />
                                                <span className="text-xs">{st.count}</span>
                                            </button>
                                            <button onClick={() => save(r)} aria-label="Save" className="rounded-full px-2 py-1.5 text-white/60 transition hover:text-white">
                                                <Bookmark className={cn("size-4", st.saved && "fill-[#f15906] text-[#f15906]")} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
