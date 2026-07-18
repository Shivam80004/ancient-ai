"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Check, Play, ArrowLeft, CircleCheck, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { VideoPlayer, isEmbedUrl } from "@/components/dashboard/VideoPlayer";
import { enrollAction } from "../actions";
import { cn } from "@/lib/utils";

type Lesson = {
    id: string;
    title: string;
    content_type: string | null;
    content_url: string | null;
    body: string | null;
    duration_minutes: number | null;
    thumbnail_url?: string | null;
};

type Props = {
    course: { id: string; title: string; description: string | null; points_reward: number; thumbnail_url?: string | null };
    lessons: Lesson[];
    completedIds: string[];
    enrolled: boolean;
};

export function CourseView({ course, lessons, completedIds, enrolled }: Props) {
    const router = useRouter();
    const [done, setDone] = useState<Set<string>>(new Set(completedIds));
    const [enrolling, startEnroll] = useTransition();
    const [saving, setSaving] = useState(false);
    const [banner, setBanner] = useState<string | null>(null);

    const firstIncomplete = useMemo(
        () => lessons.find((l) => !done.has(l.id))?.id ?? lessons[0]?.id ?? null,
        [lessons, done]
    );
    const [selectedId, setSelectedId] = useState<string | null>(firstIncomplete);
    const selected = lessons.find((l) => l.id === selectedId) ?? lessons[0] ?? null;

    const total = lessons.length;
    const completedCount = done.size;
    const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    function enroll() {
        startEnroll(async () => {
            await enrollAction(course.id);
            router.refresh();
        });
    }

    async function markComplete() {
        if (!selected || done.has(selected.id)) return;
        setSaving(true);
        try {
            const res = await fetch("/api/complete-lesson", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lessonId: selected.id }),
            });
            const data = await res.json();
            if (!res.ok) {
                setBanner(data.error ?? "Something went wrong.");
                return;
            }
            const next = new Set(done);
            next.add(selected.id);
            setDone(next);

            if (data.courseComplete) {
                confetti({ particleCount: 140, spread: 75, origin: { y: 0.6 }, colors: ["#f15906", "#dc2626", "#fc964c"] });
                setBanner(
                    `Course complete! ${data.pointsAwarded ? `+${data.pointsAwarded} pts` : ""}${
                        data.newRewards?.length ? ` · Unlocked: ${data.newRewards.join(", ")}` : ""
                    }`
                );
            } else {
                // advance to the next incomplete lesson
                const nextLesson = lessons.find((l) => !next.has(l.id));
                if (nextLesson) setSelectedId(nextLesson.id);
            }
            router.refresh(); // refresh topbar points / server data
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <Link
                        href="/dashboard/courses"
                        className="inline-flex items-center gap-1.5 text-sm text-white/50 transition hover:text-white"
                    >
                        <ArrowLeft className="size-4" /> All courses
                    </Link>
                    <h1 className="mt-2 text-3xl font-semibold text-white">{course.title}</h1>
                    <p className="mt-1 max-w-xl text-sm text-white/50">{course.description}</p>
                </div>
                <div className="hidden shrink-0 text-right sm:block">
                    <p className="text-3xl font-semibold text-white">{pct}%</p>
                    <p className="text-xs text-white/40">{completedCount}/{total} lessons</p>
                </div>
            </div>

            {banner && (
                <div
                    role="status"
                    aria-live="polite"
                    className="rounded-2xl border border-[#f15906]/30 bg-[#f15906]/10 px-4 py-3 text-sm font-medium text-white"
                >
                    {banner}
                </div>
            )}

            {!enrolled ? (
                <GlassCard className="flex flex-col items-center gap-3 p-10 text-center">
                    <p className="text-sm text-white/60">Enroll to start this course and track your progress.</p>
                    <button
                        onClick={enroll}
                        disabled={enrolling}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 transition hover:brightness-110 disabled:opacity-60"
                    >
                        {enrolling ? "Enrolling…" : `Enroll · +${course.points_reward} pts on completion`}
                    </button>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
                    {/* Lesson list */}
                    <GlassCard className="p-4">
                        <ul className="space-y-1">
                            {lessons.map((l, i) => {
                                const isDone = done.has(l.id);
                                const isActive = l.id === selected?.id;
                                return (
                                    <li key={l.id}>
                                        <button
                                            onClick={() => setSelectedId(l.id)}
                                            className={cn(
                                                "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition",
                                                isActive ? "bg-white/[0.08] text-white" : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px]",
                                                    isDone
                                                        ? "bg-gradient-to-br from-orange-600 to-red-600 text-white"
                                                        : "border border-white/15 text-white/40"
                                                )}
                                            >
                                                {isDone ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
                                            </span>
                                            {l.thumbnail_url && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={l.thumbnail_url} alt="" className="h-7 w-10 shrink-0 rounded object-cover" />
                                            )}
                                            <span className="flex-1 truncate">{l.title}</span>
                                            {l.duration_minutes ? (
                                                <span className="text-[11px] text-white/30">{l.duration_minutes}m</span>
                                            ) : null}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </GlassCard>

                    {/* Player */}
                    <GlassCard className="p-6">
                        {selected ? (
                            <>
                                <h2 className="text-xl font-semibold text-white">{selected.title}</h2>
                                <div className="mt-4">
                                    {selected.content_type === "video" && selected.content_url ? (
                                        isEmbedUrl(selected.content_url) ? (
                                            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-black">
                                                <iframe
                                                    src={selected.content_url}
                                                    title={selected.title}
                                                    className="h-full w-full"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </div>
                                        ) : (
                                            <VideoPlayer
                                                src={selected.content_url}
                                                poster={selected.thumbnail_url ?? course.thumbnail_url}
                                            />
                                        )
                                    ) : selected.content_type === "article" ? (
                                        <div className="whitespace-pre-wrap rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-sm leading-relaxed text-white/75">
                                            {selected.body}
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-white/40">
                                            Quiz content coming soon.
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex items-center justify-end">
                                    {done.has(selected.id) ? (
                                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-300">
                                            <CircleCheck className="size-4" /> Completed
                                        </span>
                                    ) : (
                                        <button
                                            onClick={markComplete}
                                            disabled={saving}
                                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 transition hover:brightness-110 disabled:opacity-60"
                                        >
                                            {saving ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4 fill-current" />}
                                            Mark complete
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-white/50">This course has no lessons yet.</p>
                        )}
                    </GlassCard>
                </div>
            )}
        </div>
    );
}
