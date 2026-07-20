"use client";

import { useState } from "react";
import { UploadCloud, Loader2, Check } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

/** Uploads a video to a public bucket (default `lesson-videos`) and returns its public URL. */
export function VideoUpload({ onUploaded, bucket = "lesson-videos" }: { onUploaded: (url: string) => void; bucket?: string }) {
    const [uploading, setUploading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    async function handle(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError(null);
        setDone(false);
        setFileName(file.name);

        const supabase = getSupabaseBrowserClient();
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${Date.now()}-${safe}`;
        const { error } = await supabase.storage
            .from(bucket)
            .upload(path, file, { upsert: false, contentType: file.type });

        if (error) {
            setError(error.message);
            setUploading(false);
            return;
        }
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        onUploaded(data.publicUrl);
        setDone(true);
        setUploading(false);
    }

    return (
        <div>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm text-white/70 transition hover:border-[#f15906]/50">
                {uploading ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : done ? (
                    <Check className="size-4 text-emerald-400" />
                ) : (
                    <UploadCloud className="size-4" />
                )}
                <span className="truncate">
                    {uploading ? "Uploading…" : done ? `Uploaded: ${fileName}` : "Upload video (mp4/webm)"}
                </span>
                <input type="file" accept="video/*" className="hidden" onChange={handle} disabled={uploading} />
            </label>
            {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
        </div>
    );
}
