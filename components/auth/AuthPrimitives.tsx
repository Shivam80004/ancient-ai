"use client";

import type { InputHTMLAttributes } from "react";

/** Google-branded OAuth button (matches the working signInWithOAuth flow). */
export function GoogleButton({
    label,
    onClick,
    disabled,
}: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/95 px-4 py-3 text-sm font-semibold text-[#1A1614] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
                />
                <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
                />
                <path
                    fill="#FBBC05"
                    d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
                />
                <path
                    fill="#EA4335"
                    d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.4 14.97.5 12 .5A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75Z"
                />
            </svg>
            {label}
        </button>
    );
}

/** Themed labelled text input. */
export function AuthField({
    label,
    ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
    return (
        <label className="block text-sm font-medium text-[#F5F5F5]/90">
            {label}
            <input
                {...props}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0f0c0b] px-4 py-3 text-base text-white placeholder-white/30 shadow-inner shadow-black/40 transition focus:border-[#f15906] focus:outline-none focus:ring-2 focus:ring-[#f15906]/30"
            />
        </label>
    );
}

/** Primary submit button using the site's ember gradient. */
export function AuthSubmit({
    children,
    disabled,
}: {
    children: React.ReactNode;
    disabled?: boolean;
}) {
    return (
        <button
            type="submit"
            disabled={disabled}
            className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {children}
        </button>
    );
}

/** Inline status / error message. */
export function AuthMessage({ tone, children }: { tone: "error" | "info"; children: React.ReactNode }) {
    return (
        <p
            role="status"
            aria-live="polite"
            className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                tone === "error"
                    ? "border-red-500/30 bg-red-500/10 text-red-200"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
            }`}
        >
            {children}
        </p>
    );
}

export function OrDivider() {
    return (
        <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/40">or</span>
            <span className="h-px flex-1 bg-white/10" />
        </div>
    );
}
