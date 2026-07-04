"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutButton() {
    const supabase = getSupabaseBrowserClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSignOut() {
        setLoading(true);
        await supabase.auth.signOut();
        router.replace("/login");
        router.refresh();
    }

    return (
        <button
            onClick={handleSignOut}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.12] disabled:opacity-60"
        >
            {loading ? "Signing out…" : "Sign out"}
        </button>
    );
}
