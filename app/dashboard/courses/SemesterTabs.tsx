"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Lock, ArrowRight, BookOpen } from "lucide-react";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { enrollAction } from "./actions";
import { cn } from "@/lib/utils";

export type CourseVM = {
    id: string;
    title: string;
    description: string | null;
    difficulty: string | null;
    points_reward: number;
    thumbnail: string | null;
    total: number;
    done: number;
    status: "none" | "in_progress" | "completed";
};

export type SemesterVM = {
    id: string;
    title: string;
    thumbnail: string | null;
    courses: CourseVM[];
};

export function SemesterTabs({ semesters }: { semesters: SemesterVM[] }) {
    const [active, setActive] = useState(0);
    const current = semesters[active];

    if (semesters.length === 0) {
        return (
            <GlassCard className="p-12 text-center">
                <BookOpen className="mx-auto size-8 text-white/30" />
                <p className="mt-3 text-sm text-white/60">No courses have been published yet.</p>
            </GlassCard>
        );
    }

    return (
        <div className="space-y-6">
            {/* Segmented control */}
            <div className="inline-flex rounded-full border border-white/[0.08] bg-white/[0.04] p-1">
                {semesters.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => setActive(i)}
                        className={cn(
                            "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                            i === active ? "text-white" : "text-white/50 hover:text-white/80"
                        )}
                    >
                        {i === active && (
                            <motion.span
                                layoutId="semester-pill"
                                transition={{ type: "spring", stiffness: 400, damping: 34 }}
                                className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-600 to-red-600"
                            />
                        )}
                        <span className="relative z-10">{s.title.replace(/^Semester \d+:\s*/, `S${i + 1} · `)}</span>
                    </button>
                ))}
            </div>

            {/* Semester banner */}
            {current.thumbnail && (
                <div className="relative h-[55vh] w-full overflow-hidden rounded-3xl border border-white/[0.08]">
                    {/* eslint-disable -next-line @next/next/no-img-element */}
                    <img src={current.thumbnail} alt={current.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <p className="absolute bottom-4 left-5 text-5xl font-semibold text-white">{current.title}</p>
                </div>
            )}

            {/* Course grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {current.courses.map((c) => (
                    <CourseCard key={c.id} course={c} />
                ))}
            </div>
        </div>
    );
}

function CourseCard({ course }: { course: CourseVM }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const pct = course.total > 0 ? Math.round((course.done / course.total) * 100) : 0;

    function enroll() {
        startTransition(async () => {
            await enrollAction(course.id);
            router.push(`/dashboard/courses/${course.id}`);
        });
    }

    return (
        <GlassCard hover className="flex flex-col overflow-hidden">
            {course.thumbnail ? (
                <div className="relative aspect-video w-full overflow-hidden border-b border-white/[0.06]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                </div>
            ) : (
                <div className="flex aspect-video w-full items-center justify-center border-b border-white/[0.06] bg-gradient-to-br from-[#221b17] to-[#0d0a09]">
                    <BookOpen className="size-8 text-white/15" />
                </div>
            )}
            <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-0.5 text-[11px] font-medium capitalize text-white/60">
                        {course.difficulty ?? "beginner"}
                    </span>
                    <span className="text-xs font-semibold text-[#f15906]">+{course.points_reward} pts</span>
                </div>

                <h3 className="mt-3 text-lg font-semibold text-white">{course.title}</h3>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-white/50">{course.description}</p>

                {course.status !== "none" && (
                    <div className="mt-4">
                        <div className="mb-1 flex justify-between text-xs text-white/40">
                            <span>{course.done}/{course.total} lessons</span>
                            <span>{pct}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-orange-600 to-red-600"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                )}

                <div className="mt-5">
                    {course.status === "completed" ? (
                        <Link
                            href={`/dashboard/courses/${course.id}`}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-300"
                        >
                            <Check className="size-4" /> Completed
                        </Link>
                    ) : course.status === "in_progress" ? (
                        <Link
                            href={`/dashboard/courses/${course.id}`}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 transition hover:brightness-110"
                        >
                            Resume ({pct}%) <ArrowRight className="size-4" />
                        </Link>
                    ) : (
                        <button
                            onClick={enroll}
                            disabled={pending}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.12] disabled:opacity-60"
                        >
                            {pending ? "Enrolling…" : "Enroll"}
                        </button>
                    )}
                </div>
            </div>
        </GlassCard>
    );
}
