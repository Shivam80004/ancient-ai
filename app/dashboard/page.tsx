import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import SignOutButton from "./SignOutButton";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Your Ancient AI Academy dashboard.",
};

const QUICK_LINKS = [
    { href: "/courses", label: "Courses", desc: "Guided programs for growth" },
    { href: "/events-and-mentorship", label: "Events & Mentorship", desc: "Learn with our guides" },
    { href: "/retreats", label: "Retreats", desc: "Immersive experiences" },
    { href: "/free-resources", label: "Free Resources", desc: "A growing library" },
];

export default async function DashboardPage() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Route guard — no session means back to login.
    if (!user) {
        redirect("/login");
    }

    const displayName =
        (user.user_metadata?.full_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        user.email?.split("@")[0] ??
        "Seeker";

    const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
    const joined = user.created_at ? new Date(user.created_at).toLocaleDateString() : "—";
    const lastSignIn = user.last_sign_in_at
        ? new Date(user.last_sign_in_at).toLocaleString()
        : "—";

    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-[#1A1614] text-[#F5F5F5]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-32 -top-24 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,_rgba(241,89,6,0.18),_transparent_70%)] blur-3xl"
            />

            <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-36 lg:px-10">
                {/* Header */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        {avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={avatarUrl}
                                alt={displayName}
                                className="h-16 w-16 rounded-full border border-white/15 object-cover"
                            />
                        ) : (
                            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-red-600 text-2xl font-bold text-white">
                                {displayName.charAt(0).toUpperCase()}
                            </span>
                        )}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">
                                Dashboard
                            </p>
                            <h1
                                className="mt-1 text-3xl font-medium text-white"
                                style={{ fontFamily: "var(--font-oswald)" }}
                            >
                                Welcome back, {displayName}
                            </h1>
                        </div>
                    </div>
                    <SignOutButton />
                </div>

                {/* Account summary */}
                <section className="mt-12 rounded-[28px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_25px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                    <h2 className="text-lg font-semibold text-white">Your account</h2>
                    <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <div>
                            <dt className="text-xs uppercase tracking-[0.2em] text-[#A8B9B9]">Email</dt>
                            <dd className="mt-1 text-sm text-white">{user.email}</dd>
                        </div>
                        <div>
                            <dt className="text-xs uppercase tracking-[0.2em] text-[#A8B9B9]">Member since</dt>
                            <dd className="mt-1 text-sm text-white">{joined}</dd>
                        </div>
                        <div>
                            <dt className="text-xs uppercase tracking-[0.2em] text-[#A8B9B9]">Last sign in</dt>
                            <dd className="mt-1 text-sm text-white">{lastSignIn}</dd>
                        </div>
                    </dl>
                </section>

                {/* Quick links */}
                <h2 className="mt-14 text-lg font-semibold text-white">Continue exploring</h2>
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {QUICK_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="group rounded-[24px] border border-white/10 bg-gradient-to-br from-[#221b17] to-[#0d0a09] p-6 transition hover:border-[#f15906]/40 hover:shadow-[0_20px_50px_rgba(241,89,6,0.12)]"
                        >
                            <p
                                className="text-lg font-medium text-white"
                                style={{ fontFamily: "var(--font-oswald)" }}
                            >
                                {link.label}
                            </p>
                            <p className="mt-2 text-sm text-[#A8B9B9]">{link.desc}</p>
                            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#f15906] opacity-0 transition group-hover:opacity-100">
                                Explore →
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
