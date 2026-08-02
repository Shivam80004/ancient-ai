"use client";

import { useState } from "react";
import { UploadCloud, Loader2, Check } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { cn } from "@/lib/utils";

/** Uploads any file to a public bucket and returns its public URL. */
export function FileUpload({
    onUploaded,
    bucket = "resources",
    accept,
    label = "Upload file",
    compact = false,
}: {
    onUploaded: (url: string, name: string) => void;
    bucket?: string;
    accept?: string;
    label?: string;
    compact?: boolean;
}) {
    const [uploading, setUploading] = useState(false);
    const [done, setDone] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handle(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError(null);
        setDone(null);

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
        onUploaded(data.publicUrl, file.name);
        setDone(file.name);
        setUploading(false);
    }

    return (
        <div>
            <label
                className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.03] text-white/70 transition hover:border-[#f15906]/50",
                    compact ? "px-2.5 py-1.5 text-xs" : "px-4 py-2.5 text-sm"
                )}
            >
                {uploading ? <Loader2 className="size-4 animate-spin" /> : done ? <Check className="size-4 text-emerald-400" /> : <UploadCloud className="size-4" />}
                <span className="truncate">{uploading ? "Uploading…" : done ? `Uploaded: ${done}` : label}</span>
                <input type="file" accept={accept} className="hidden" onChange={handle} disabled={uploading} />
            </label>
            {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
        </div>
    );
}
