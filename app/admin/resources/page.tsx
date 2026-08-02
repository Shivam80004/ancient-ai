import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guard";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { ResourcesManager, type CategoryRow, type ResourceRow } from "./ResourcesManager";

export const metadata: Metadata = { title: "Admin · Free Resources" };
export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
    await requireAdmin();
    const db = await createSupabaseServerClient(); // admin RLS lets an admin read everything

    const { data: categories } = await db
        .from("resource_categories")
        .select("id, name, description")
        .order("order_index")
        .order("created_at");

    const { data: resources } = await db
        .from("resources")
        .select("id, category_id, kind, title, description, file_url, poster_url, body, is_published, like_count")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">Admin</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Free Resources</h1>
                <p className="mt-1 text-sm text-white/50">
                    Create categories and upload free content — PDFs, images, videos, quotes, or links.
                </p>
            </div>
            <ResourcesManager
                categories={(categories ?? []) as CategoryRow[]}
                resources={(resources ?? []) as ResourceRow[]}
            />
        </div>
    );
}
