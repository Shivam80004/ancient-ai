"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Heart, Volume2, VolumeX, Sparkles, Clapperboard, Play, ChevronUp, ChevronDown } from "lucide-react";
import { toggleLike } from "./likeAction";
import { cn } from "@/lib/utils";

export type VibePost = {
    id: string;
    kind: "video" | "image" | "text";
    media_url: string | null;
    poster_url: string | null;
    caption: string | null;
    like_count: number;
    liked: boolean;
};

export function VibeFeed({ posts }: { posts: VibePost[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
    const pinged = useRef<Set<string>>(new Set());
    const dwellTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    const [muted, setMuted] = useState(true);
    const [activeId, setActiveId] = useState<string | null>(posts[0]?.id ?? null);
    const [paused, setPaused] = useState<Record<string, boolean>>({});
    const [likes, setLikes] = useState<Record<string, { liked: boolean; count: number }>>(
        Object.fromEntries(posts.map((p) => [p.id, { liked: p.liked, count: p.like_count }]))
    );

    const ping = useCallback((id: string) => {
        if (pinged.current.has(id)) return;
        pinged.current.add(id);
        fetch("/api/vibe/view", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId: id }),
        }).catch(() => { });
    }, []);

    // Track which post is in view; schedule a view ping after a short dwell.
    useEffect(() => {
        const root = containerRef.current;
        if (!root) return;
        const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-vibe-id]"));
        const obs = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    const id = (e.target as HTMLElement).dataset.vibeId!;
                    if (e.isIntersecting && e.intersectionRatio >= 0.6) {
                        setActiveId(id);
                        if (!pinged.current.has(id) && !dwellTimers.current[id]) {
                            dwellTimers.current[id] = setTimeout(() => ping(id), 1500);
                        }
                    } else if (dwellTimers.current[id]) {
                        clearTimeout(dwellTimers.current[id]);
                        delete dwellTimers.current[id];
                    }
                }
            },
            { root, threshold: [0, 0.6, 1] }
        );
        sections.forEach((s) => obs.observe(s));
        return () => obs.disconnect();
    }, [ping, posts.length]);

    // Play the active video, pause the rest.
    useEffect(() => {
        Object.entries(videoRefs.current).forEach(([id, v]) => {
            if (!v) return;
            if (id === activeId) {
                v.muted = muted;
                v.play().catch(() => { });
            } else {
                v.pause();
            }
        });
    }, [activeId, muted]);

    function onLike(p: VibePost) {
        const cur = likes[p.id] ?? { liked: false, count: 0 };
        const nextLiked = !cur.liked;
        setLikes((s) => ({ ...s, [p.id]: { liked: nextLiked, count: cur.count + (nextLiked ? 1 : -1) } }));
        toggleLike(p.id, cur.liked).catch(() => setLikes((s) => ({ ...s, [p.id]: cur })));
    }

    const curIdx = posts.findIndex((p) => p.id === activeId);
    function navigate(dir: number) {
        const base = curIdx < 0 ? 0 : curIdx;
        const target = Math.max(0, Math.min(posts.length - 1, base + dir));
        containerRef.current
            ?.querySelector<HTMLElement>(`[data-vibe-id="${posts[target].id}"]`)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (posts.length === 0) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center">
                <Clapperboard className="size-10 text-white/25" />
                <p className="text-sm text-white/60">No vibes yet — check back soon.</p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop up/down navigation */}
            <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
                <button
                    onClick={() => navigate(-1)}
                    disabled={curIdx <= 0}
                    aria-label="Previous post"
                    className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-gradient-to-bl to-orange-600 from-red-800 text-white backdrop-blur-md transition hover:bg-white/[0.14] disabled:opacity-30"
                >
                    <ChevronUp className="size-5" />
                </button>
                <button
                    onClick={() => navigate(1)}
                    disabled={curIdx >= posts.length - 1}
                    aria-label="Next post"
                    className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-gradient-to-bl to-orange-600 from-red-800 text-white backdrop-blur-md transition hover:bg-white/[0.14] disabled:opacity-30"
                >
                    <ChevronDown className="size-5" />
                </button>
            </div>

            <div
                ref={containerRef}
                className="mx-auto h-[calc(100dvh-8rem)] w-full max-w-[440px] snap-y snap-mandatory overflow-y-scroll rounded-3xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {posts.map((p) => {
                    const st = likes[p.id] ?? { liked: false, count: 0 };
                    return (
                        <section
                            key={p.id}
                            data-vibe-id={p.id}
                            className="flex h-full snap-start items-center justify-center py-2"
                        >
                            <div className="relative h-full max-h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-black">
                                {/* Media */}
                                {p.kind === "video" && p.media_url ? (
                                    <video
                                        ref={(el) => { videoRefs.current[p.id] = el; }}
                                        src={p.media_url}
                                        poster={p.poster_url ?? undefined}
                                        className="h-full w-full object-cover"
                                        loop
                                        muted={muted}
                                        playsInline
                                        onPlay={() => setPaused((s) => ({ ...s, [p.id]: false }))}
                                        onPause={() => setPaused((s) => ({ ...s, [p.id]: true }))}
                                        onClick={(e) => {
                                            const v = e.currentTarget;
                                            if (v.paused) v.play().catch(() => { });
                                            else v.pause();
                                        }}
                                    />
                                ) : p.kind === "image" && p.media_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={p.media_url} alt={p.caption ?? ""} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3a1608] via-[#1a0d07] to-black p-8">
                                        <p
                                            className="text-center text-2xl font-medium leading-snug text-white"
                                            style={{ fontFamily: "var(--font-oswald)" }}
                                        >
                                            {p.caption}
                                        </p>
                                    </div>
                                )}

                                {/* Paused indicator — tap anywhere to resume */}
                                {p.kind === "video" && paused[p.id] && (
                                    <button
                                        onClick={() => videoRefs.current[p.id]?.play().catch(() => { })}
                                        aria-label="Play"
                                        className="absolute inset-0 flex items-center justify-center bg-black/20"
                                    >
                                        <span className="flex size-20 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm">
                                            <Play className="size-9 fill-current" />
                                        </span>
                                    </button>
                                )}

                                {/* Readability gradient (for video/image with caption) */}
                                {p.kind !== "text" && (
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />
                                )}

                                {/* Mute toggle (videos only) */}
                                {p.kind === "video" && (
                                    <button
                                        onClick={() => setMuted((m) => !m)}
                                        aria-label={muted ? "Unmute" : "Mute"}
                                        className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
                                    >
                                        {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                                    </button>
                                )}

                                {/* Like */}
                                <button
                                    onClick={() => onLike(p)}
                                    aria-label="Like"
                                    className="absolute bottom-16 right-3 flex flex-col items-center gap-1 text-white"
                                >
                                    <span className={cn("flex size-12 items-center justify-center rounded-full backdrop-blur-sm transition", st.liked ? "bg-[#f15906]/90" : "bg-black/50 hover:bg-black/70")}>
                                        <Heart className={cn("size-6", st.liked && "fill-current")} />
                                    </span>
                                    <span className="text-xs font-semibold">{st.count}</span>
                                </button>

                                {/* Caption + earn hint */}
                                {p.kind !== "text" && p.caption && (
                                    <p className="absolute inset-x-4 bottom-4 max-w-[80%] text-sm font-medium text-white drop-shadow">
                                        {p.caption}
                                    </p>
                                )}
                                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm">
                                    <Sparkles className="size-3 text-[#f15906]" /> Watch to earn
                                </span>
                            </div>
                        </section>
                    );
                })}
            </div>
        </>
    );
}
