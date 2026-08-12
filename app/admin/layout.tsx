import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guard";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireAdmin(); // redirects non-admins to /dashboard (or /login)
    return <AdminShell>{children}</AdminShell>;
}
