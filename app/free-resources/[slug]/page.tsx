import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { RESOURCES } from '@/lib/resources-data';
import type { Metadata } from 'next';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return RESOURCES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const resource = RESOURCES.find((r) => r.slug === slug);
    if (!resource) return {};
    return {
        title: `${resource.title} — Ancient AI Free Resources`,
        description: resource.description,
    };
}

export default async function FreeResourcePage({ params }: Props) {
    const { slug } = await params;
    const resource = RESOURCES.find((r) => r.slug === slug);
    if (!resource) notFound();

    return (
        <main className="bg-black min-h-screen text-white">

            {/* ── Hero ───────────────────────────────────────────────────────── */}
            <section className="relative h-[70dvh] flex items-end overflow-hidden">
                {/* Background image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={resource.heroImage}
                        alt={resource.title}
                        className="w-full h-full object-cover"
                    />
                    {/* Multi-stop gradient: dark at bottom, transparent at top */}
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
                </div>

                {/* Back button */}
                <Link
                    href="/free-resources"
                    className="absolute top-8 left-6 md:left-12 z-20 flex items-center gap-2 text-white/60 hover:text-white text-sm tracking-widest uppercase transition-colors duration-300 group"
                >
                    <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    All Resources
                </Link>

                {/* Hero content */}
                <div className="relative z-10 px-6 md:px-16 pb-16 max-w-5xl">
                    <span className="inline-block text-xs tracking-[0.3em] uppercase text-orange-400 mb-4 font-medium">
                        {resource.category}
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95] mb-6">
                        {resource.title}
                    </h1>
                    <p className="text-lg md:text-xl text-white/70 font-light max-w-xl leading-relaxed">
                        {resource.description}
                    </p>

                    {/* Quick meta pills */}
                    <div className="flex flex-wrap gap-3 mt-8">
                        {[
                            { label: 'Format', value: resource.format },
                            { label: 'Length', value: resource.length },
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
            <section className="max-w-6xl mx-auto px-6 md:px-16 py-12 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16 lg:gap-24">

                    {/* Left: Long-form content */}
                    <div>
                        {/* About */}
                        <div className="mb-16">
                            <span className="text-2xl md:text-3xl  text-orange-400 md:pb-3 pb-2 font-normal block">About the Resource</span>
                            <p className="text-lg md:text-xl text-white/75 font-light leading-relaxed">
                                {resource.longDescription}
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-linear-to-r from-white/10 via-orange-500/20 to-transparent" />

                        {/* Who is it for */}
                        <div className="mb-16">
                            <span className="text-2xl md:text-3xl  text-orange-400 md:pb-3 pb-2 font-normal block">Who Is This For?</span>
                            <p className="text-lg text-white/70 font-light leading-relaxed">
                                {resource.whoIsItFor}
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-linear-to-r from-white/10 via-orange-500/20 to-transparent" />

                        {/* Highlights */}
                        <div>
                            <span className="text-2xl md:text-3xl text-orange-400 pb-6 font-normal block">What's Included</span>
                            <ul className="space-y-4">
                                {resource.highlights.map((h, i) => (
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
                                    src={resource.image}
                                    alt={resource.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Meta rows */}
                                {[
                                    { label: 'Format', value: resource.format },
                                    { label: 'Length', value: resource.length },
                                    { label: 'Access', value: 'Instant & Free' },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex justify-between items-center py-3 border-b border-white/8">
                                        <span className="text-xs tracking-widest uppercase text-white/40">{label}</span>
                                        <span className="text-sm text-white font-medium">{value}</span>
                                    </div>
                                ))}

                                {/* CTA */}
                                <a
                                    href={resource.externalLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group mt-2 w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-linear-to-r from-orange-600 to-red-600 text-white font-medium text-sm tracking-wide hover:from-orange-500 hover:to-red-500 transition-all duration-300 shadow-lg shadow-orange-900/30"
                                >
                                    {resource.ctaText}
                                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>

                                <p className="text-center text-xs text-white/30 pt-1">
                                    Opens in a new tab
                                </p>
                            </div>
                        </div>

                        {/* Back link below card */}
                        <Link
                            href="/free-resources"
                            className="mt-6 flex items-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-widest uppercase transition-colors duration-300 group"
                        >
                            <svg className="w-3 h-3 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to all resources
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Other Resources ─────────────────────────────────────────────── */}
            <section className="border-t border-white/8 py-20 px-6 md:px-16 max-w-6xl mx-auto">
                <span className="text-2xl md:text-3xl  text-white md:pb-10 pb-5 font-normal block uppercase">Other Resources</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {RESOURCES.filter((r) => r.slug !== resource.slug).slice(0, 3).map((r) => (
                        <Link
                            key={r.slug}
                            href={`/free-resources/${r.slug}`}
                            className="group relative overflow-hidden rounded-xl border border-white/8 bg-white/2 hover:border-orange-500/30 hover:bg-white/4 transition-all duration-500"
                        >
                            <div className="aspect-video overflow-hidden">
                                <img
                                    src={r.image}
                                    alt={r.title}
                                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                />
                            </div>
                            <div className="p-5">
                                <span className="text-sm tracking-[0.2em] uppercase text-orange-400/70">{r.category}</span>
                                <h3 className="text-lg font-light text-white mt-1 group-hover:text-orange-300 transition-colors duration-300">{r.title}</h3>
                                <p className="text-sm text-white/40 mt-2 line-clamp-2">{r.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
