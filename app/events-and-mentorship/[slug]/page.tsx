import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MENTORSHIPS, type MentorshipProgram } from '@/lib/mentorship-data';
import MentorshipCTA from '@/components/mentorship/MentorshipCTA';
import type { Metadata } from 'next';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return MENTORSHIPS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const program = MENTORSHIPS.find((m) => m.slug === slug);
    if (!program) return {};
    return {
        title: `${program.title} — Ancient AI Mentorship`,
        description: program.description,
    };
}

export default async function MentorshipProgramPage({ params }: Props) {
    const { slug } = await params;
    const program = MENTORSHIPS.find((m) => m.slug === slug);
    if (!program) notFound();

    return (
        <main className="bg-black min-h-screen text-white">

            {/* ── Hero ───────────────────────────────────────────────────────── */}
            <section className="relative h-[80dvh] flex items-end overflow-hidden">
                {/* Background image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={program.heroImage}
                        alt={program.title}
                        className="w-full h-full object-cover"
                    />
                    {/* Multi-stop gradient: dark at bottom, transparent at top */}
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-r from-black/70 via-transparent to-transparent" />
                </div>

                {/* Back button */}
                <Link
                    href="/events-and-mentorship"
                    className="absolute top-8 left-6 md:left-12 z-20 flex items-center gap-2 text-white/60 hover:text-white text-sm tracking-widest uppercase transition-colors duration-300 group"
                >
                    <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    All Programs
                </Link>

                {/* Hero content */}
                <div className="relative z-10 px-6 md:px-16 pb-16 max-w-5xl">
                    <span className="inline-block text-xs tracking-[0.3em] uppercase text-orange-400 mb-4 font-medium">
                        {program.category}
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95] mb-6">
                        {program.title}
                    </h1>
                    <p className="text-lg md:text-xl text-white/70 font-light max-w-xl leading-relaxed">
                        {program.description}
                    </p>

                    {/* Quick meta pills */}
                    <div className="flex flex-wrap gap-3 mt-8">
                        {[
                            { label: 'Duration', value: program.duration },
                            { label: 'Format', value: program.format },
                            { label: 'Seats', value: program.seats },
                        ].map(({ label, value }) => (
                            <div
                                key={label}
                                className="flex flex-col px-5 py-3 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm"
                            >
                                <span className="text-sm tracking-[0.2em] uppercase text-white/40">{label}</span>
                                <span className="text-sm font-medium text-white mt-0.5">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative bottom border */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-orange-500/40 to-transparent" />
            </section>

            {/* ── Body ───────────────────────────────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-6 md:px-16 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16 lg:gap-24">

                    {/* Left: Long-form content */}
                    <div>
                        {/* About */}
                        <div className="mb-16">
                            <span className="text-lg md:text-2xl tracking-[0.3em] uppercase text-orange-400 mb-4 block">About the Program</span>
                            <p className="text-lg md:text-xl text-white/75 font-light leading-relaxed">
                                {program.longDescription}
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-linear-to-r from-white/10 via-orange-500/20 to-transparent mb-16" />

                        {/* Who is it for */}
                        <div className="mb-16">
                            <span className="text-lg md:text-2xl tracking-[0.3em] uppercase text-orange-400 mb-4 block">Who Is This For?</span>
                            <p className="text-lg text-white/70 font-light leading-relaxed">
                                {program.whoIsItFor}
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-linear-to-r from-white/10 via-orange-500/20 to-transparent mb-16" />

                        {/* Highlights */}
                        <div>
                            <span className="text-lg md:text-2xl tracking-[0.3em] uppercase text-orange-400 mb-6 block">What's Included</span>
                            <ul className="space-y-4">
                                {program.highlights.map((h, i) => (
                                    <li key={i} className="flex items-start gap-4 group">
                                        <span className="mt-1 shrink-0 w-5 h-5 rounded-full border border-orange-500/40 flex items-center justify-center bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors duration-300">
                                            <svg className="w-2.5 h-2.5 text-orange-400" fill="currentColor" viewBox="0 0 8 8">
                                                <circle cx="4" cy="4" r="4" />
                                            </svg>
                                        </span>
                                        <span className="text-white/70 text-base font-light leading-relaxed">{h}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right: Sticky apply card */}
                    <div className="lg:sticky lg:top-24 self-start">
                        <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm overflow-hidden">
                            {/* Program thumbnail */}
                            <div className="aspect-4/3 overflow-hidden">
                                <img
                                    src={program.thumbnail}
                                    alt={program.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Meta rows */}
                                {[
                                    { label: 'Duration', value: program.duration },
                                    { label: 'Format', value: program.format },
                                    { label: 'Availability', value: program.seats },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex justify-between items-center py-3 border-b border-white/8">
                                        <span className="text-xs tracking-widest uppercase text-white/40">{label}</span>
                                        <span className="text-sm text-white font-medium">{value}</span>
                                    </div>
                                ))}

                                {/* CTA */}
                                <Link
                                    href="/contact-us"
                                    className="group mt-2 w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-linear-to-r from-orange-600 to-red-600 text-white font-medium text-sm tracking-wide hover:from-orange-500 hover:to-red-500 transition-all duration-300 shadow-lg shadow-orange-900/30"
                                >
                                    Apply for this Program
                                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>

                                <p className="text-center text-xs text-white/30 pt-1">
                                    Limited seats — applications reviewed within 48 hrs
                                </p>
                            </div>
                        </div>

                        {/* Back link below card */}
                        <Link
                            href="/events-and-mentorship"
                            className="mt-6 flex items-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-widest uppercase transition-colors duration-300 group"
                        >
                            <svg className="w-3 h-3 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to all programs
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Other Programs ─────────────────────────────────────────────── */}
            <section className="border-t border-white/8 py-20 px-6 md:px-16 max-w-6xl mx-auto">
                <span className="text-lg md:text-2xl tracking-[0.3em] uppercase text-white mb-10 block">Other Programs</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MENTORSHIPS.filter((m) => m.slug !== program.slug).map((m) => (
                        <Link
                            key={m.slug}
                            href={m.link}
                            className="group relative overflow-hidden rounded-xl border border-white/8 bg-white/2 hover:border-orange-500/30 hover:bg-white/4 transition-all duration-500"
                        >
                            <div className="aspect-video overflow-hidden">
                                <img
                                    src={m.thumbnail}
                                    alt={m.title}
                                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                />
                            </div>
                            <div className="p-5">
                                <span className="text-sm tracking-[0.2em] uppercase text-orange-400/70">{m.category}</span>
                                <h3 className="text-lg font-light text-white mt-1 group-hover:text-orange-300 transition-colors duration-300">{m.title}</h3>
                                <p className="text-sm text-white/40 mt-2 line-clamp-2">{m.description}</p>
                                <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/40 group-hover:text-orange-400 transition-colors duration-300">
                                    View Program
                                    <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <MentorshipCTA />
        </main>
    );
}
