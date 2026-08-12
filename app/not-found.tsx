import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Page Not Found",
    robots: { index: false, follow: false },
};

export default function NotFound() {
    return (
        <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0A0A0A] px-6 py-24 text-center text-white">
            <div
                aria-hidden
                className="pointer-events-none absolute -top-24 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(241,89,6,0.18),_transparent_70%)] blur-3xl"
            />
            <p className="relative z-10 text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">
                404
            </p>
            <h1
                className="relative z-10 mt-3 text-4xl font-light text-white sm:text-5xl"
                style={{ fontFamily: "var(--font-oswald)" }}
            >
                This path leads nowhere
            </h1>
            <p className="relative z-10 mt-4 max-w-md text-sm leading-relaxed text-white/60">
                The page you are looking for doesn&apos;t exist or has moved. Let&apos;s guide you
                back.
            </p>
            <Link
                href="/"
                className="relative z-10 mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 transition hover:brightness-110"
            >
                Return home
            </Link>
        </main>
    );
}
