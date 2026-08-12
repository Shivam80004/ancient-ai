import { redirect } from "next/navigation";
import type { Metadata } from "next";
import SignupForm from "./SignupForm";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export const metadata: Metadata = {
    title: "Create Account",
    description: "Create your Ancient AI Academy account.",
    robots: { index: false, follow: false },
};

export default async function SignupPage() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        redirect("/dashboard");
    }

    return <SignupForm />;
}
