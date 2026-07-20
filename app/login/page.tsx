import { redirect } from "next/navigation";
import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in to your Ancient AI Academy account.",
};

export default async function LoginPage() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Already signed in → straight to the dashboard.
    if (user) {
        redirect("/dashboard");
    }

    return <LoginForm />;
}
