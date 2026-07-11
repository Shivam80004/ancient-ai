import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/db";

/**
 * Service-role Supabase client — **SERVER ONLY**. Bypasses RLS.
 *
 * Never import this into a client component. Use it exclusively inside route
 * handlers / server actions, and only after an ownership or `requireAdmin()`
 * check. It is the only client permitted to write to `point_ledger`,
 * `earned_rewards`, and other server-authoritative tables.
 */
export function createSupabaseAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
        throw new Error(
            "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (add the service-role key to .env)"
        );
    }

    return createClient<Database>(url, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}
