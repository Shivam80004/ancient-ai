"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Eye, EyeOff, Pencil, Check, Loader2, Film, ImageIcon, Type, Heart } from "lucide-react";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { ImageUpload } from "@/app/admin/courses/ImageUpload";
import { VideoUpload } from "@/app/admin/courses/VideoUpload";
import { cn } from "@/lib/utils";
import { createVibePost, updateVibePost, togglePublishVibe, deleteVibePost, type VibeInput } from "./actions";

export type VibePostRow = {
    id: string;
    kind: string;
    media_url: string | null;
    poster_url: string | null;
    caption: string | null;
    points_reward: number;
    like_count: number;
    is_published: boolean | null;
};

const input = "w-full rounded-xl border border-white/10 bg-[#0f0c0b] px-3 py-2 text-sm text-white placeholder-white/30 focus:border-[#f15906] focus:outline-none focus:ring-2 focus:ring-[#f15906]/30";
const btn = "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60";
const ghostBtn = "inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/[0.08]";
const VIBE_BUCKET = "vibe-media";

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
    return (
        <label className={cn("block", className)}>
            <span className="mb-1 block text-xs font-medium text-white/50">{label}</span>
            {children}
        </label>
    );
}
function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <span className="mb-1 block text-xs font-medium text-white/50">{label}</span>
            {children}
        </div>
    );
}

const KIND_ICON: Record<string, typeof Film> = { video: Film, image: ImageIcon, text: Type };

/** Shared add/edit form. `initial` present → edit mode. */
function VibeForm({ initial, onSave, onCancel }: { initial?: VibePostRow; onSave: (v: VibeInput) => void; onCancel?: () => void }) {
    const [kind, setKind] = useState<"video" | "image" | "text">((initial?.kind as "video" | "image" | "text") ?? "video");
    const [caption, setCaption] = useState(initial?.caption ?? "");
    const [points, setPoints] = useState(initial?.points_reward ?? 5);
    const [mediaUrl, setMediaUrl] = useState<string | null>(initial?.media_url ?? null);
    const [posterUrl, setPosterUrl] = useState<string | null>(initial?.poster_url ?? null);
    const [pending, start] = useTransition();

    const mediaReady = kind === "text" || !!mediaUrl;

    return (
        <div className="space-y-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
            <Field label="Post type">
                <select className={input} value={kind} onChange={(e) => setKind(e.target.value as "video" | "image" | "text")}>
                    <option value="video">Video</option>
                    <option value="image">Image</option>
                    <option value="text">Text</option>
                </select>
            </Field>

            {kind === "video" && (
                <>
                    <FieldLabel label="Video (mp4/webm)">
                        <VideoUpload bucket={VIBE_BUCKET} onUploaded={setMediaUrl} />
                        {mediaUrl && <p className="mt-1 truncate text-xs text-emerald-300/80">Video set ✓</p>}
                    </FieldLabel>
                    <FieldLabel label="Poster image (optional)">
                        <ImageUpload compact bucket={VIBE_BUCKET} label={posterUrl ? "Poster ✓" : "Upload poster"} onUploaded={setPosterUrl} />
                    </FieldLabel>
                </>
            )}
            {kind === "image" && (
                <FieldLabel label="Image">
                    <ImageUpload compact bucket={VIBE_BUCKET} label={mediaUrl ? "Image ✓" : "Upload image"} onUploaded={setMediaUrl} />
                </FieldLabel>
            )}

            <Field label="Caption">
                <textarea className={input} rows={2} placeholder="Write a caption…" value={caption} onChange={(e) => setCaption(e.target.value)} />
            </Field>
            <Field label="Points for watching" className="w-40">
                <input className={input} type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} />
            </Field>

            <div className="flex gap-2">
                <button
                    className={btn}
                    disabled={pending || !mediaReady}
                    onClick={() => start(async () => {
                        onSave({ kind, media_url: kind === "text" ? null : mediaUrl, poster_url: kind === "video" ? posterUrl : null, caption, points_reward: points });
                    })}
                >
                    <Check className="size-4" /> {initial ? "Save changes" : "Save post"}
                </button>
                {onCancel && <button className={ghostBtn} onClick={onCancel}>Cancel</button>}
            </div>
        </div>
    );
}

function PostItem({ post }: { post: VibePostRow }) {
    const router = useRouter();
    const [editing, setEditing] = useState(false);
    const [pending, start] = useTransition();
    const Icon = KIND_ICON[post.kind] ?? Film;

    if (editing) {
        return (
            <VibeForm
                initial={post}
                onCancel={() => setEditing(false)}
                onSave={(v) => start(async () => { await updateVibePost(post.id, v); setEditing(false); router.refresh(); })}
            />
        );
    }

    return (
        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-black">
                {post.poster_url || (post.kind === "image" && post.media_url) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.poster_url ?? post.media_url ?? ""} alt="" className="h-full w-full object-cover" />
                ) : (
                    <Icon className="size-5 text-white/40" />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white/85">{post.caption || <span className="text-white/40">No caption</span>}</p>
                <p className="mt-0.5 flex items-center gap-2 text-xs text-white/40">
                    <span className="capitalize">{post.kind}</span>
                    <span>· +{post.points_reward} pts</span>
                    <span className="inline-flex items-center gap-1"><Heart className="size-3" /> {post.like_count}</span>
                </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
                <button
                    onClick={() => start(async () => { await togglePublishVibe(post.id, !post.is_published); router.refresh(); })}
                    disabled={pending}
                    className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition", post.is_published ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-white/10 bg-white/[0.04] text-white/50")}
                >
                    {post.is_published ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    {post.is_published ? "Published" : "Draft"}
                </button>
                <button onClick={() => setEditing(true)} aria-label="Edit" className="rounded-full border border-white/10 bg-white/[0.04] p-1.5 text-white/50 transition hover:text-white"><Pencil className="size-3.5" /></button>
                <button
                    onClick={() => { if (!confirm("Delete this post?")) return; start(async () => { await deleteVibePost(post.id); router.refresh(); }); }}
                    disabled={pending}
                    aria-label="Delete"
                    className="rounded-full border border-white/10 bg-white/[0.04] p-1.5 text-white/50 transition hover:border-rose-500/30 hover:text-rose-300"
                >
                    {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                </button>
            </div>
        </div>
    );
}

export function VibeManager({ posts }: { posts: VibePostRow[] }) {
    const router = useRouter();
    const [adding, setAdding] = useState(false);
    const [, start] = useTransition();

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Existing posts */}
            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">Posts</h2>
                <div className="mt-4 space-y-2">
                    {posts.map((p) => <PostItem key={p.id} post={p} />)}
                    {posts.length === 0 && <p className="text-sm text-white/50">No posts yet — add one.</p>}
                </div>
            </GlassCard>

            {/* Add */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">Add a post</h2>
                    {!adding && (
                        <button onClick={() => setAdding(true)} className={btn}><Plus className="size-4" /> New post</button>
                    )}
                </div>
                {adding && (
                    <div className="mt-4">
                        <VibeForm
                            onCancel={() => setAdding(false)}
                            onSave={(v) => start(async () => { await createVibePost(v); setAdding(false); router.refresh(); })}
                        />
                    </div>
                )}
                {!adding && <p className="mt-4 text-sm text-white/50">Click “New post” to publish a video, image, or text to the vibe feed.</p>}
            </GlassCard>
        </div>
    );
}
