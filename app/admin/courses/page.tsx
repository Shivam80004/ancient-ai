import type { Metadata } from "next";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { CurriculumManager, type SemesterNode } from "./CurriculumManager";

export const metadata: Metadata = { title: "Admin · Curriculum" };
export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
    const admin = createSupabaseAdminClient(); // sees drafts + published

    const { data: semesters } = await admin
        .from("semesters")
        .select(
            "id, title, is_published, courses(id, title, description, difficulty, points_reward, is_published, order_index, lessons(id, title, content_type, order_index))"
        )
        .order("order_index");

    const tree: SemesterNode[] = (semesters ?? []).map((s) => ({
        id: s.id,
        title: s.title,
        is_published: s.is_published,
        courses: [...(s.courses ?? [])]
            .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
            .map((c) => ({
                id: c.id,
                title: c.title,
                description: c.description,
                difficulty: c.difficulty,
                points_reward: c.points_reward,
                is_published: c.is_published,
                lessons: [...(c.lessons ?? [])].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)),
            })),
    }));

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">Admin</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Curriculum</h1>
                <p className="mt-1 text-sm text-white/50">
                    Create semesters, courses, and lessons. Upload your own videos — published items appear to learners.
                </p>
            </div>
            <CurriculumManager semesters={tree} />
        </div>
    );
}
