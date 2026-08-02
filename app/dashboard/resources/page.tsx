import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ResourcesBrowser, type BrowserCategory, type BrowserResource } from "./ResourcesBrowser";

export const metadata: Metadata = { title: "Free Resources" };
export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: categories } = await supabase
        .from("resource_categories")
        .select("id, name")
        .order("order_index")
        .order("created_at");

    // RLS returns only published resources.
    const { data: resources } = await supabase
        .from("resources")
        .select("id, category_id, kind, title, description, file_url, poster_url, body, like_count")
        .order("created_at", { ascending: false });

    const [{ data: likes }, { data: saves }] = await Promise.all([
        supabase.from("resource_likes").select("resource_id").eq("user_id", user.id),
        supabase.from("resource_saves").select("resource_id").eq("user_id", user.id),
    ]);
    const likedIds = new Set((likes ?? []).map((l) => l.resource_id as string));
    const savedIds = new Set((saves ?? []).map((s) => s.resource_id as string));

    const vm: BrowserResource[] = (resources ?? []).map((r) => ({
        id: r.id,
        category_id: r.category_id,
        kind: r.kind as BrowserResource["kind"],
        title: r.title,
        description: r.description,
        file_url: r.file_url,
        poster_url: r.poster_url,
        body: r.body,
        like_count: r.like_count ?? 0,
        liked: likedIds.has(r.id),
        saved: savedIds.has(r.id),
    }));

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">Library</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Free Resources</h1>
                <p className="mt-1 text-sm text-white/50">Curated PDFs, videos, images, and reflections — free to explore.</p>
            </div>
            <ResourcesBrowser categories={(categories ?? []) as BrowserCategory[]} resources={vm} />
        </div>
    );
}
