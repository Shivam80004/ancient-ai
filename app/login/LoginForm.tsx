"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import {
    AuthField,
    AuthMessage,
    AuthSubmit,
    GoogleButton,
    OrDivider,
} from "@/components/auth/AuthPrimitives";

export default function LoginForm() {
    const supabase = getSupabaseBrowserClient();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        // Same logic as the tested email/password flow.
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        // Refresh server components so the session cookie is picked up, then go to dashboard.
        router.replace("/dashboard");
        router.refresh();
    }

    async function handleGoogleLogin() {
        setError("");
        // Same signInWithOAuth logic; return through the callback route to /dashboard.
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
            },
        });
    }

    return (
        <AuthShell
            eyebrow="Welcome back"
            title="Sign in to your account"
            subtitle="Continue your journey with Ancient AI Academy."
            footer={
                <>
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="font-semibold text-[#f15906] hover:underline">
                        Create one
                    </Link>
                </>
            }
        >
            <GoogleButton label="Continue with Google" onClick={handleGoogleLogin} disabled={loading} />

            <OrDivider />

            <form className="space-y-4" onSubmit={handleSubmit}>
                <AuthField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@email.com"
                    autoComplete="email"
                />
                <AuthField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Your password"
                    autoComplete="current-password"
                />

                <AuthSubmit disabled={loading}>{loading ? "Signing in…" : "Sign in"}</AuthSubmit>

                {error && <AuthMessage tone="error">{error}</AuthMessage>}
            </form>
        </AuthShell>
    );
}
