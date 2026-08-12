import GoogleLoginDemo from "./GoogleLoginDemo";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign In", robots: { index: false, follow: false } };

export default async function GoogleLoginPage() {
    const supabase = await createSupabaseServerClient()
    const {
        data: { user },
    } = await supabase.auth.getUser();

    console.log({ user });
    return <GoogleLoginDemo user={user} />;
}