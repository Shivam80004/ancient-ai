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

export default function SignupForm() {
    const supabase = getSupabaseBrowserClient();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setInfo("");

        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        // Same logic as the tested sign-up flow.
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        // If email confirmation is required, there's no active session yet.
        if (!data.session) {
            setInfo("Account created — check your inbox to confirm your email, then sign in.");
            setLoading(false);
            return;
        }

        // Confirmation disabled → session is live, go to the dashboard.
        router.replace("/dashboard");
        router.refresh();
    }

    async function handleGoogleLogin() {
        setError("");
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
            },
        });
    }

    return (
        <AuthShell
            eyebrow="Get started"
            title="Create your account"
            subtitle="Join Ancient AI Academy and begin your journey."
            footer={
                <>
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-[#f15906] hover:underline">
                        Sign in
                    </Link>
                </>
            }
        >
            <GoogleButton label="Sign up with Google" onClick={handleGoogleLogin} disabled={loading} />

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
                    minLength={6}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                />
                <AuthField
                    label="Confirm password"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                />

                <AuthSubmit disabled={loading}>
                    {loading ? "Creating account…" : "Create account"}
                </AuthSubmit>

                {error && <AuthMessage tone="error">{error}</AuthMessage>}
                {info && <AuthMessage tone="info">{info}</AuthMessage>}
            </form>
        </AuthShell>
    );
}
