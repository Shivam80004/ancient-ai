import { requireAdmin } from "@/lib/auth/guard";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireAdmin(); // redirects non-admins to /dashboard (or /login)
    return <AdminShell>{children}</AdminShell>;
}
