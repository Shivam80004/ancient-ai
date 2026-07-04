import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
    eyebrow: string;
    title: string;
    subtitle: string;
    children: ReactNode;
    footer: ReactNode;
};

/**
 * Shared split-screen frame for the login / signup pages.
 * Left: Ancient AI Academy branding panel. Right: the auth form.
 */
export function AuthShell({ eyebrow, title, subtitle, children, footer }: AuthShellProps) {
    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-[#1A1614] text-[#F5F5F5]">
            {/* Ambient warm glows */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(241,89,6,0.22),_transparent_70%)] blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(140,74,50,0.28),_transparent_70%)] blur-3xl"
            />

            <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-0 px-6 py-28 lg:grid-cols-2 lg:gap-16 lg:px-10">
                {/* Branding panel */}
                <section className="hidden flex-col justify-between rounded-[36px] border border-white/10 bg-gradient-to-br from-[#221b17] via-[#1A1614] to-[#0d0a09] p-12 shadow-[0_45px_120px_rgba(0,0,0,0.55)] lg:flex lg:min-h-[560px]">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-3">
                            <img src="/logo-plain.png" alt="Ancient AI Academy" className="h-14 w-auto" />
                        </Link>
                        <p className="mt-14 text-xs font-semibold uppercase tracking-[0.4em] text-[#f15906]/80">
                            Ancient AI Academy
                        </p>
                        <h2
                            className="mt-6 max-w-md text-4xl font-medium leading-[1.15] text-white"
                            style={{ fontFamily: "var(--font-oswald)" }}
                        >
                            A better human experience for the mind, body, and soul.
                        </h2>
                        <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#A8B9B9]">
                            Continue your journey — access your courses, events, retreats, and
                            curated resources in one calm, focused space.
                        </p>
                    </div>

                    <ul className="mt-12 space-y-4">
                        {[
                            "Guided courses & mentorship",
                            "Immersive retreats and events",
                            "A growing library of free resources",
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-3 text-sm text-[#F5F5F5]/85">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-red-600 text-[11px] font-bold text-white">
                                    ✓
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Form panel */}
                <section className="mx-auto w-full max-w-md">
                    {/* Mobile logo */}
                    <Link href="/" className="mb-10 flex items-center justify-center lg:hidden">
                        <img src="/logo-plain.png" alt="Ancient AI Academy" className="h-12 w-auto" />
                    </Link>

                    <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_35px_90px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-10">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">
                            {eyebrow}
                        </p>
                        <h1
                            className="mt-3 text-3xl font-medium text-white"
                            style={{ fontFamily: "var(--font-oswald)" }}
                        >
                            {title}
                        </h1>
                        <p className="mt-2 text-sm text-[#A8B9B9]">{subtitle}</p>

                        <div className="mt-8">{children}</div>
                    </div>

                    <div className="mt-6 text-center text-sm text-[#A8B9B9]">{footer}</div>
                </section>
            </div>
        </main>
    );
}
