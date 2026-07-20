import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

/**
 * OAuth / email-confirmation callback.
 * Supabase redirects here with a `?code=` param; we exchange it for a session
 * (which sets the auth cookies) and then forward the user to `next` (default /dashboard).
 */
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/dashboard";

    if (code) {
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // Something went wrong — send them back to login with a flag.
    return NextResponse.redirect(`${origin}/login?error=auth`);
}
