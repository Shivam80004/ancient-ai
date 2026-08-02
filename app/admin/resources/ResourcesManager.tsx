"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Check, Trash2, Loader2, Eye, EyeOff, FileText, ImageIcon, Film, Quote, Link2, Paperclip, Heart } from "lucide-react";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { ImageUpload } from "@/app/admin/courses/ImageUpload";
import { VideoUpload } from "@/app/admin/courses/VideoUpload";
import { FileUpload } from "@/app/admin/courses/FileUpload";
import { cn } from "@/lib/utils";
import {
    createCategory, updateCategory, deleteCategory,
    createResource, updateResource, togglePublishResource, deleteResource, type ResourceInput,
} from "./actions";

export type CategoryRow = { id: string; name: string; description: string | null };
export type ResourceRow = {
    id: string; category_id: string | null; kind: string; title: string; description: string | null;
    file_url: string | null; poster_url: string | null; body: string | null; is_published: boolean | null; like_count: number;
};

const input = "w-full rounded-xl border border-white/10 bg-[#0f0c0b] px-3 py-2 text-sm text-white placeholder-white/30 focus:border-[#f15906] focus:outline-none focus:ring-2 focus:ring-[#f15906]/30";
const btn = "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60";
const ghostBtn = "inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/[0.08]";
const RES_BUCKET = "resources";
const KINDS = ["pdf", "image", "video", "quote", "link", "file"] as const;
const KIND_ICON: Record<string, typeof FileText> = { pdf: FileText, image: ImageIcon, video: Film, quote: Quote, link: Link2, file: Paperclip };

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

/* ── Category panel ── */
function CategoryItem({ c }: { c: CategoryRow }) {
    const router = useRouter();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(c.name);
    const [desc, setDesc] = useState(c.description ?? "");
    const [pending, start] = useTransition();

    if (editing) {
        return (
            <div className="space-y-2 rounded-2xl border border-[#f15906]/20 bg-[#f15906]/[0.04] p-3">
                <Field label="Name"><input className={input} value={name} onChange={(e) => setName(e.target.value)} /></Field>
                <Field label="Description"><input className={input} value={desc} onChange={(e) => setDesc(e.target.value)} /></Field>
                <div className="flex gap-2">
                    <button className={btn} disabled={pending || !name.trim()} onClick={() => start(async () => { await updateCategory(c.id, name.trim(), desc); setEditing(false); router.refresh(); })}><Check className="size-4" /> Save</button>
                    <button className={ghostBtn} onClick={() => setEditing(false)}>Cancel</button>
                </div>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div>
                <p className="text-sm font-medium text-white">{c.name}</p>
                {c.description && <p className="text-xs text-white/45">{c.description}</p>}
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => setEditing(true)} aria-label="Edit" className="rounded-full border border-white/10 bg-white/[0.04] p-1.5 text-white/50 transition hover:text-white"><Pencil className="size-3.5" /></button>
                <button onClick={() => { if (!confirm("Delete this category? Its resources become uncategorized.")) return; start(async () => { await deleteCategory(c.id); router.refresh(); }); }} disabled={pending} aria-label="Delete" className="rounded-full border border-white/10 bg-white/[0.04] p-1.5 text-white/50 transition hover:border-rose-500/30 hover:text-rose-300">
                    {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                </button>
            </div>
        </div>
    );
}

/* ── Resource form (add/edit) ── */
function ResourceForm({ categories, initial, onSave, onCancel }: { categories: CategoryRow[]; initial?: ResourceRow; onSave: (v: ResourceInput) => void; onCancel?: () => void }) {
    const [kind, setKind] = useState<ResourceInput["kind"]>((initial?.kind as ResourceInput["kind"]) ?? "pdf");
    const [categoryId, setCategoryId] = useState<string>(initial?.category_id ?? (categories[0]?.id ?? ""));
    const [title, setTitle] = useState(initial?.title ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [fileUrl, setFileUrl] = useState<string | null>(initial?.file_url ?? null);
    const [posterUrl, setPosterUrl] = useState<string | null>(initial?.poster_url ?? null);
    const [body, setBody] = useState(initial?.body ?? "");
    const [pending, start] = useTransition();

    const ready = title.trim() && (kind === "quote" ? !!body.trim() : !!fileUrl);

    return (
        <div className="space-y-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="flex gap-2">
                <Field label="Type" className="flex-1">
                    <select className={input} value={kind} onChange={(e) => setKind(e.target.value as ResourceInput["kind"])}>
                        {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
                    </select>
                </Field>
                <Field label="Category" className="flex-1">
                    <select className={input} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                        <option value="">— none —</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </Field>
            </div>

            <Field label="Title"><input className={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. 5 Minute Morning Meditation" /></Field>
            <Field label="Description"><textarea className={input} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" /></Field>

            {kind === "quote" ? (
                <Field label="Quote / text"><textarea className={input} rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="The quote or written content" /></Field>
            ) : kind === "link" ? (
                <Field label="Link URL"><input className={input} value={fileUrl ?? ""} onChange={(e) => setFileUrl(e.target.value || null)} placeholder="https://…" /></Field>
            ) : kind === "image" ? (
                <FieldLabel label="Image"><ImageUpload compact bucket={RES_BUCKET} label={fileUrl ? "Image ✓" : "Upload image"} onUploaded={setFileUrl} /></FieldLabel>
            ) : kind === "video" ? (
                <FieldLabel label="Video"><VideoUpload bucket={RES_BUCKET} onUploaded={setFileUrl} />{fileUrl && <p className="mt-1 text-xs text-emerald-300/80">Video set ✓</p>}</FieldLabel>
            ) : (
                <FieldLabel label={kind === "pdf" ? "PDF file" : "Attachment"}>
                    <FileUpload bucket={RES_BUCKET} accept={kind === "pdf" ? "application/pdf,.pdf" : undefined} label={fileUrl ? "File ✓" : "Upload file"} onUploaded={(u) => setFileUrl(u)} />
                </FieldLabel>
            )}

            {kind !== "quote" && (
                <FieldLabel label="Thumbnail (optional)"><ImageUpload compact bucket={RES_BUCKET} label={posterUrl ? "Thumbnail ✓" : "Upload thumbnail"} onUploaded={setPosterUrl} /></FieldLabel>
            )}

            <div className="flex gap-2">
                <button
                    className={btn}
                    disabled={pending || !ready}
                    onClick={() => start(async () => onSave({
                        category_id: categoryId || null, kind, title, description,
                        file_url: kind === "quote" ? null : fileUrl,
                        poster_url: kind === "quote" ? null : posterUrl,
                        body: kind === "quote" ? body : null,
                    }))}
                >
                    <Check className="size-4" /> {initial ? "Save changes" : "Save resource"}
                </button>
                {onCancel && <button className={ghostBtn} onClick={onCancel}>Cancel</button>}
            </div>
        </div>
    );
}

function ResourceItem({ r, categories }: { r: ResourceRow; categories: CategoryRow[] }) {
    const router = useRouter();
    const [editing, setEditing] = useState(false);
    const [pending, start] = useTransition();
    const Icon = KIND_ICON[r.kind] ?? FileText;

    if (editing) {
        return <ResourceForm categories={categories} initial={r} onCancel={() => setEditing(false)} onSave={(v) => start(async () => { await updateResource(r.id, v); setEditing(false); router.refresh(); })} />;
    }
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-black">
                {r.poster_url || (r.kind === "image" && r.file_url) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.poster_url ?? r.file_url ?? ""} alt="" className="h-full w-full object-cover" />
                ) : (
                    <Icon className="size-4 text-white/40" />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{r.title}</p>
                <p className="flex items-center gap-2 text-xs text-white/40">
                    <span className="capitalize">{r.kind}</span>
                    <span className="inline-flex items-center gap-1"><Heart className="size-3" /> {r.like_count}</span>
                </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
                <button onClick={() => start(async () => { await togglePublishResource(r.id, !r.is_published); router.refresh(); })} disabled={pending}
                    className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition", r.is_published ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-white/10 bg-white/[0.04] text-white/50")}>
                    {r.is_published ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    {r.is_published ? "Published" : "Draft"}
                </button>
                <button onClick={() => setEditing(true)} aria-label="Edit" className="rounded-full border border-white/10 bg-white/[0.04] p-1.5 text-white/50 transition hover:text-white"><Pencil className="size-3.5" /></button>
                <button onClick={() => { if (!confirm("Delete this resource?")) return; start(async () => { await deleteResource(r.id); router.refresh(); }); }} disabled={pending} aria-label="Delete" className="rounded-full border border-white/10 bg-white/[0.04] p-1.5 text-white/50 transition hover:border-rose-500/30 hover:text-rose-300">
                    {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                </button>
            </div>
        </div>
    );
}

export function ResourcesManager({ categories, resources }: { categories: CategoryRow[]; resources: ResourceRow[] }) {
    const router = useRouter();
    const [catName, setCatName] = useState("");
    const [catDesc, setCatDesc] = useState("");
    const [adding, setAdding] = useState(false);
    const [pending, start] = useTransition();

    return (
        <div className="space-y-6">
            {/* Categories */}
            <GlassCard className="p-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">Categories</h2>
                <div className="mt-4 space-y-2">
                    {categories.map((c) => <CategoryItem key={c.id} c={c} />)}
                    {categories.length === 0 && <p className="text-sm text-white/50">No categories yet.</p>}
                </div>
                <div className="mt-4 flex flex-wrap items-end gap-2 border-t border-white/[0.06] pt-4">
                    <Field label="New category" className="flex-1"><input className={input} value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g. Peace of Mind" /></Field>
                    <Field label="Description" className="flex-1"><input className={input} value={catDesc} onChange={(e) => setCatDesc(e.target.value)} placeholder="Optional" /></Field>
                    <button className={btn} disabled={pending || !catName.trim()} onClick={() => start(async () => { await createCategory(catName.trim(), catDesc); setCatName(""); setCatDesc(""); router.refresh(); })}>
                        <Plus className="size-4" /> Add
                    </button>
                </div>
            </GlassCard>

            {/* Resources */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">Resources</h2>
                    {!adding && <button onClick={() => setAdding(true)} className={btn}><Plus className="size-4" /> Add resource</button>}
                </div>
                {adding && (
                    <div className="mt-4">
                        <ResourceForm categories={categories} onCancel={() => setAdding(false)} onSave={(v) => start(async () => { await createResource(v); setAdding(false); router.refresh(); })} />
                    </div>
                )}
                <div className="mt-4 space-y-2">
                    {resources.map((r) => <ResourceItem key={r.id} r={r} categories={categories} />)}
                    {resources.length === 0 && <p className="text-sm text-white/50">No resources yet.</p>}
                </div>
            </GlassCard>
        </div>
    );
}
