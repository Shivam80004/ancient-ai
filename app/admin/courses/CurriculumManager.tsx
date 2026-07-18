"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Eye, EyeOff, ChevronDown, Video, FileText, Loader2, ImageIcon } from "lucide-react";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { VideoUpload } from "./VideoUpload";
import { ImageUpload } from "./ImageUpload";
import { cn } from "@/lib/utils";
import { createSemester, createCourse, createLesson, togglePublish, deleteRow, setThumbnail } from "./actions";

export type LessonNode = { id: string; title: string; content_type: string | null; thumbnail_url?: string | null };
export type CourseNode = {
    id: string;
    title: string;
    description: string | null;
    difficulty: string | null;
    points_reward: number;
    is_published: boolean | null;
    thumbnail_url?: string | null;
    lessons: LessonNode[];
};
export type SemesterNode = {
    id: string;
    title: string;
    is_published: boolean | null;
    thumbnail_url?: string | null;
    courses: CourseNode[];
};

const input = "w-full rounded-xl border border-white/10 bg-[#0f0c0b] px-3 py-2 text-sm text-white placeholder-white/30 focus:border-[#f15906] focus:outline-none focus:ring-2 focus:ring-[#f15906]/30";
const btn = "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60";

/** Thumbnail preview + upload for an existing semester / course / lesson. */
function ThumbControl({
    table,
    id,
    url,
    onDone,
    size = "h-16 w-28",
}: {
    table: "semesters" | "courses" | "lessons";
    id: string;
    url?: string | null;
    onDone: () => void;
    size?: string;
}) {
    const [, start] = useTransition();
    return (
        <div className="flex items-center gap-2">
            <div className={cn("shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]", size)}>
                {url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt="thumbnail" className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-white/20">
                        <ImageIcon className="size-4" />
                    </div>
                )}
            </div>
            <ImageUpload
                compact
                label={url ? "Replace" : "Add thumbnail"}
                onUploaded={(u) => start(async () => { await setThumbnail(table, id, u); onDone(); })}
            />
        </div>
    );
}

export function CurriculumManager({ semesters }: { semesters: SemesterNode[] }) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [thumb, setThumb] = useState<string | null>(null);
    const [pending, start] = useTransition();
    const refresh = () => router.refresh();

    return (
        <div className="space-y-6">
            {/* Add semester */}
            <GlassCard className="flex flex-wrap items-center gap-3 p-4">
                <input className={cn(input, "flex-1")} placeholder="New semester title (e.g. Semester 3: Mind & Focus)" value={title} onChange={(e) => setTitle(e.target.value)} />
                <ImageUpload compact label={thumb ? "Thumbnail ✓" : "Thumbnail"} onUploaded={setThumb} />
                <button
                    className={btn}
                    disabled={pending || !title.trim()}
                    onClick={() =>
                        start(async () => {
                            await createSemester(title.trim(), thumb);
                            setTitle(""); setThumb(null);
                            refresh();
                        })
                    }
                >
                    <Plus className="size-4" /> Add semester
                </button>
            </GlassCard>

            {semesters.map((s) => (
                <GlassCard key={s.id} className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold text-white">{s.title}</h2>
                        <div className="flex items-center gap-2">
                            <PublishToggle table="semesters" id={s.id} value={!!s.is_published} onDone={refresh} />
                            <DeleteBtn table="semesters" id={s.id} onDone={refresh} />
                        </div>
                    </div>
                    <div className="mt-3">
                        <ThumbControl table="semesters" id={s.id} url={s.thumbnail_url} onDone={refresh} />
                    </div>

                    <div className="mt-4 space-y-3 border-l border-white/[0.06] pl-4">
                        {s.courses.map((c) => (
                            <CourseBlock key={c.id} course={c} onDone={refresh} />
                        ))}
                        <CourseAdder semesterId={s.id} onDone={refresh} />
                    </div>
                </GlassCard>
            ))}

            {semesters.length === 0 && (
                <p className="text-sm text-white/50">No semesters yet — add one above.</p>
            )}
        </div>
    );
}

function PublishToggle({ table, id, value, onDone }: { table: "semesters" | "courses"; id: string; value: boolean; onDone: () => void }) {
    const [pending, start] = useTransition();
    return (
        <button
            onClick={() => start(async () => { await togglePublish(table, id, !value); onDone(); })}
            disabled={pending}
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition",
                value ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-white/10 bg-white/[0.04] text-white/50"
            )}
        >
            {value ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
            {value ? "Published" : "Draft"}
        </button>
    );
}

function DeleteBtn({ table, id, onDone }: { table: "semesters" | "courses" | "lessons"; id: string; onDone: () => void }) {
    const [pending, start] = useTransition();
    return (
        <button
            onClick={() => {
                if (!confirm("Delete this and everything under it?")) return;
                start(async () => { await deleteRow(table, id); onDone(); });
            }}
            disabled={pending}
            className="rounded-full border border-white/10 bg-white/[0.04] p-1.5 text-white/50 transition hover:border-rose-500/30 hover:text-rose-300"
            aria-label="Delete"
        >
            {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
        </button>
    );
}

function CourseBlock({ course, onDone }: { course: CourseNode; onDone: () => void }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center justify-between gap-3">
                <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 text-left">
                    <ChevronDown className={cn("size-4 text-white/40 transition", open && "rotate-180")} />
                    {course.thumbnail_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={course.thumbnail_url} alt="" className="h-8 w-12 rounded object-cover" />
                    )}
                    <span className="font-medium text-white">{course.title}</span>
                    <span className="text-xs text-white/40">· {course.lessons.length} lessons · +{course.points_reward} pts</span>
                </button>
                <div className="flex items-center gap-2">
                    <PublishToggle table="courses" id={course.id} value={!!course.is_published} onDone={onDone} />
                    <DeleteBtn table="courses" id={course.id} onDone={onDone} />
                </div>
            </div>

            {open && (
                <div className="mt-3 space-y-2 border-l border-white/[0.06] pl-4">
                    <ThumbControl table="courses" id={course.id} url={course.thumbnail_url} onDone={onDone} />
                    {course.lessons.map((l) => (
                        <div key={l.id} className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                            <span className="flex items-center gap-2 text-sm text-white/80">
                                {l.content_type === "video" ? <Video className="size-3.5 text-[#f15906]" /> : <FileText className="size-3.5 text-white/40" />}
                                {l.title}
                            </span>
                            <div className="flex items-center gap-2">
                                <ThumbControl table="lessons" id={l.id} url={l.thumbnail_url} onDone={onDone} size="h-9 w-14" />
                                <DeleteBtn table="lessons" id={l.id} onDone={onDone} />
                            </div>
                        </div>
                    ))}
                    <LessonAdder courseId={course.id} onDone={onDone} />
                </div>
            )}
        </div>
    );
}

function CourseAdder({ semesterId, onDone }: { semesterId: string; onDone: () => void }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ title: "", description: "", difficulty: "beginner", points: 100 });
    const [thumb, setThumb] = useState<string | null>(null);
    const [pending, start] = useTransition();

    if (!open)
        return (
            <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#f15906] hover:underline">
                <Plus className="size-4" /> Add course
            </button>
        );

    return (
        <div className="space-y-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
            <input className={input} placeholder="Course title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea className={input} placeholder="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="flex gap-2">
                <select className={input} value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
                <input className={input} type="number" placeholder="Points" value={form.points} onChange={(e) => setForm({ ...form, points: Number(e.target.value) })} />
            </div>
            <ImageUpload compact label={thumb ? "Thumbnail ✓" : "Course thumbnail"} onUploaded={setThumb} />
            <div className="flex gap-2">
                <button
                    className={btn}
                    disabled={pending || !form.title.trim()}
                    onClick={() =>
                        start(async () => {
                            await createCourse({ semesterId, ...form, thumbnailUrl: thumb });
                            setForm({ title: "", description: "", difficulty: "beginner", points: 100 });
                            setThumb(null);
                            setOpen(false);
                            onDone();
                        })
                    }
                >
                    Save course
                </button>
                <button onClick={() => setOpen(false)} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/60">Cancel</button>
            </div>
        </div>
    );
}

function LessonAdder({ courseId, onDone }: { courseId: string; onDone: () => void }) {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<"video" | "article">("video");
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState(0);
    const [contentUrl, setContentUrl] = useState("");
    const [body, setBody] = useState("");
    const [thumb, setThumb] = useState<string | null>(null);
    const [pending, start] = useTransition();

    if (!open)
        return (
            <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#f15906] hover:underline">
                <Plus className="size-4" /> Add lesson
            </button>
        );

    return (
        <div className="space-y-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
            <input className={input} placeholder="Lesson title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <div className="flex gap-2">
                <select className={input} value={type} onChange={(e) => setType(e.target.value as "video" | "article")}>
                    <option value="video">Video</option>
                    <option value="article">Article</option>
                </select>
                <input className={input} type="number" placeholder="Minutes" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
            </div>

            {type === "video" ? (
                <div className="space-y-2">
                    <VideoUpload onUploaded={setContentUrl} />
                    {contentUrl && <p className="truncate text-xs text-emerald-300/80">Video ready ✓</p>}
                </div>
            ) : (
                <textarea className={input} placeholder="Article content (markdown/plain text)" rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
            )}

            <ImageUpload compact label={thumb ? "Thumbnail ✓" : "Lesson thumbnail (poster)"} onUploaded={setThumb} />

            <div className="flex gap-2">
                <button
                    className={btn}
                    disabled={pending || !title.trim() || (type === "video" && !contentUrl)}
                    onClick={() =>
                        start(async () => {
                            await createLesson({
                                courseId,
                                title,
                                contentType: type,
                                contentUrl: type === "video" ? contentUrl : null,
                                body: type === "article" ? body : null,
                                duration,
                                thumbnailUrl: thumb,
                            });
                            setTitle(""); setContentUrl(""); setBody(""); setDuration(0); setThumb(null);
                            setOpen(false);
                            onDone();
                        })
                    }
                >
                    Save lesson
                </button>
                <button onClick={() => setOpen(false)} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/60">Cancel</button>
            </div>
        </div>
    );
}
