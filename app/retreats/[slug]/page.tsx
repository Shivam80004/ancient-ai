'use client';
import React, { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RevealText from '@/components/animation/RevealText';
import { TRIPS_DATA } from '@/lib/trips-data';
import AnimatedText from '@/components/animation/AnimatedText';
import JsonLd from "@/components/seo/JsonLd";
import { retreatSchema, breadcrumbSchema } from "@/lib/seo/structured-data";

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function TripDetailPage() {
    const params = useParams();
    const slug = typeof params.slug === 'string' ? params.slug : '';
    const trip = TRIPS_DATA[slug];

    const heroRef = useRef<HTMLDivElement>(null);
    const heroBgRef = useRef<HTMLImageElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const galleryParams = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!trip) return;

        const ctx = gsap.context(() => {
            // Hero Parallax Setup
            gsap.to(heroBgRef.current, {
                yPercent: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                }
            });

            // Fade up content sections
            const sections = gsap.utils.toArray('.fade-up-section');
            sections.forEach((section: any) => {
                gsap.fromTo(section,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

            // Gallery Stagger Reveal
            const galleryImages = gsap.utils.toArray('.gallery-img');
            if (galleryImages.length > 0) {
                gsap.fromTo(galleryImages,
                    { opacity: 0, scale: 0.9, y: 30 },
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 1,
                        stagger: 0.15,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: '.gallery-container',
                            start: "top 80%",
                        }
                    }
                );
            }

        });

        return () => ctx.revert();
    }, [trip]);

    // Only show full content for vrindavan-yatra and tattva-x; all other slugs show Coming Soon
    if (slug !== 'vrindavan-yatra' && slug !== 'tattva-x') {
        return (
            <main className="bg-black min-h-screen flex items-center justify-center overflow-hidden relative">
                {/* Ambient glow */}
                {/* <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px]" />
                    <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-red-700/10 rounded-full blur-[80px]" />
                </div> */}

                <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
                    {/* Icon / symbol */}
                    {/* <div className="flex items-center justify-center w-20 h-20 rounded-full border border-orange-500/30 bg-orange-500/10 mx-auto mb-8 backdrop-blur-sm">
                        <svg className="w-9 h-9 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div> */}

                    <p className="text-orange-400 text-xs tracking-[0.4em] uppercase font-semibold mb-4">Sacred Journey</p>
                    <h1 className="text-5xl md:text-7xl font-light text-white mb-6 leading-tight tracking-tight">
                        Coming<br />
                        <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Soon</span>
                    </h1>
                    <p className="text-white/50 text-lg font-light leading-relaxed mb-10">
                        This retreat is being crafted with care. We are preparing something truly sacred for you. Stay tuned.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/retreats"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 text-sm tracking-wide"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Retreats
                        </Link>
                        <Link
                            href="/contact-us"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-orange-600 to-red-600 text-white text-sm tracking-wide font-medium hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Notify Me
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (!trip) {
        return (
            <main className="bg-black min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-white mb-4">Retreat Not Found</h1>
                    <p className="text-white/60 text-lg mb-8">The spiritual journey you are looking for doesn&apos;t exist.</p>
                    <Link
                        href="/retreats"
                        className="inline-block px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300"
                    >
                        ← Back to Retreats
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <>
            <JsonLd data={[retreatSchema(trip), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Retreats", path: "/retreats" }, { name: trip.title, path: `/retreats/${trip.slug}` }])]} />
        <main className="bg-black min-h-screen text-white/90 selection:bg-orange-500/30 selection:text-white">

            {/* ── Immersive Hero ───────────────────────────────────────────── */}
            <section ref={heroRef} className="relative h-[90vh] md:h-screen w-full overflow-hidden flex items-end">
                <div className="absolute inset-0 z-0">
                    <img
                        ref={heroBgRef}
                        src={trip.image}
                        alt={trip.title}
                        className="w-full h-[120%] object-cover object-top -mt-[10%]"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/95" />
                    {/* Shadow vignette */}
                    <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)] pointer-events-none" />
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-24">
                    <div className="overflow-hidden mb-4">
                        <span className="inline-block text-white font-medium tracking-[0.3em] text-xs md:text-sm uppercase">
                            {trip.label}
                        </span>
                    </div>

                    <RevealText
                        type="chars"
                        className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[1.1] mb-6"
                        stagger={0.03}
                    >
                        {trip.title}
                    </RevealText>

                    <div className="flex flex-wrap gap-6 md:gap-12 mt-8 border-t border-white/10 pt-8 max-w-2xl">
                        <div>
                            <span className="block text-white/40 uppercase tracking-[0.2em] text-[10px] mb-1">Duration</span>
                            <span className="text-white text-sm md:text-base font-light">{trip.duration}</span>
                        </div>
                        <div>
                            <span className="block text-white/40 uppercase tracking-[0.2em] text-[10px] mb-1">Group Size</span>
                            <span className="text-white text-sm md:text-base font-light">{trip.groupSize}</span>
                        </div>
                        <div>
                            <span className="block text-white/40 uppercase tracking-[0.2em] text-[10px] mb-1">Next Date</span>
                            <span className="text-sm md:text-base font-light">{trip.dates || 'TBD'}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Content Grid ─────────────────────────────────────────────── */}
            <section ref={contentRef} className="max-w-7xl mx-auto px-6 md:px-12 py-20 pb-0">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 lg:gap-24 relative items-start">

                    {/* Left: Long Form Details & Images */}
                    <div className="space-y-20">
                        {/* The Experience */}
                        <div className="fade-up-section">
                            <h2 className="text-xs md:text-sm text-orange-500 font-medium tracking-[0.3em] uppercase mb-6 flex items-center gap-4">
                                {/* <span className="w-12 h-px bg-orange-500/50" /> */}
                                The Experience
                            </h2>
                            <AnimatedText className="text-lg md:text-xl lg:text-3xl text-white/80 font-light leading-relaxed">
                                {trip.description}
                            </AnimatedText>
                        </div>

                        {/* Showcase Image 1 */}
                        {trip.galleryImages && trip.galleryImages[0] && (
                            <div className="fade-up-section relative w-full h-[60vh] md:h-[70vh] rounded-3xl overflow-hidden">
                                <Image
                                    src={trip.galleryImages[0]}
                                    alt="Journey Glimpse"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        {/* Highlights */}
                        <div className="fade-up-section border border-white/5 rounded-3xl md:p-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full mix-blend-screen filter blur-[80px]" />
                            <h2 className="text-2xl font-light text-white mb-8 relative z-10">Journey Highlights</h2>
                            <ul className="space-y-6 relative z-10">
                                {trip.highlights.map((highlight, index) => (
                                    <li key={index} className="flex items-start gap-4 group">
                                        <div className="mt-1.5 shrink-0 flex items-center justify-center w-6 h-6 rounded-full border border-white/20 group-hover:border-orange-500 transition-colors duration-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/50 group-hover:bg-orange-500 transition-colors duration-300" />
                                        </div>
                                        <span className="text-lg text-white/70 group-hover:text-white/90 transition-colors duration-300 leading-relaxed font-light">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Showcase Image 2 */}
                        {trip.galleryImages && trip.galleryImages[1] && (
                            <div className="fade-up-section relative w-full h-[60vh] md:h-[70vh] rounded-3xl overflow-hidden">
                                <Image
                                    src={trip.galleryImages[1]}
                                    alt="Journey Details"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        {/* Itinerary (If Available) */}
                        {trip.itinerary && trip.itinerary.length > 0 && (
                            <div className="fade-up-section">
                                <h2 className="text-2xl font-light text-white mb-8 relative z-10">
                                    {/* <span className="w-12 h-px bg-orange-500/50" /> */}
                                    Sample Itinerary
                                </h2>
                                <div className="space-y-8 pl-4 md:pl-0 border-l border-white/10 md:border-none">
                                    {trip.itinerary.map((day, idx) => (
                                        <div key={idx} className="relative md:pl-12">
                                            {/* Desktop Timeline Dot */}
                                            <div className="hidden md:block absolute left-px top-2 w-2 h-2 rounded-full bg-white transform -translate-x-1/2 ring-4 ring-black" />
                                            {/* Mobile Timeline Dot */}
                                            {/* <div className="md:hidden absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-white ring-4 ring-black" /> */}

                                            <div className="md:hidden absolute -left-px top-0 bottom-0 w-px bg-white/10 -z-10" />
                                            <div className="hidden md:block absolute left-0 top-0 bottom-[-32px] w-px bg-white/10 -z-10" />

                                            <span className="text-orange-400 text-xs tracking-[0.2em] uppercase font-semibold mb-2 block">{day.day}</span>
                                            <h3 className="text-xl text-white mb-2">{day.title}</h3>
                                            <p className="text-white/50 font-light leading-relaxed">{day.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Showcase Image 3 */}
                        {trip.galleryImages && trip.galleryImages[2] && (
                            <div className="fade-up-section relative w-full h-[60vh] md:h-[70vh] rounded-3xl overflow-hidden">
                                <Image
                                    src={trip.galleryImages[2]}
                                    alt="Transformation"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {/* Right: Sticky Booking Sidebar */}
                    <div className="lg:sticky lg:top-32 w-full fade-up-section order-first lg:order-last mb-12 lg:mb-0 z-30">
                        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                            {/* Decorative Corner Glow */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-600/30 rounded-full blur-[60px]" />

                            <div className="relative z-10">
                                <div className="mb-8">
                                    <span className="block text-white/50 text-xs tracking-widest uppercase mb-2">Investment Reserve</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-light text-white">{trip.price || 'Contact Us'}</span>
                                        {trip.price && <span className="text-white/40 text-sm">/ person</span>}
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                        <span className="text-sm text-white/50">Next Available</span>
                                        <span className="text-sm text-white">{trip.dates?.split(':')[1]?.trim() || 'Join Waitlist'}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                        <span className="text-sm text-white/50">Capacity</span>
                                        <span className="text-sm text-white">{trip.groupSize}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/contact-us"
                                    className="group relative w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-white text-black font-semibold tracking-wide overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
                                >
                                    <span className="relative z-10">Secure Your Spot</span>
                                    <svg className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                    <div className="absolute inset-0 bg-linear-to-r from-orange-200 to-white transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                                </Link>

                                <p className="text-center text-xs text-white/30 mt-6 font-light">
                                    No upfront payment required to register interest. Our team will contact you for a brief discovery call.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* ── Cinematic Gallery ────────────────────────────────────────── */}
            {trip.galleryImages && trip.galleryImages.length > 3 && (
                <section className="gallery-container w-full mt-32 px-4 md:px-8">
                    <div className="max-w-[1600px] mx-auto">
                        <h2 className="text-lg md:text-xl text-white/90 text-center font-medium tracking-[0.4em] uppercase mb-12">
                            More Glimpses of the journey
                        </h2>

                        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                            {trip.galleryImages.slice(3).map((img, index) => (
                                <div key={index} className="gallery-img break-inside-avoid relative rounded-2xl overflow-hidden group">
                                    <Image
                                        src={img}
                                        alt={`Gallery ${index}`}
                                        width={800}
                                        height={600}
                                        className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    {/* Hover gradient sweep */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Final Footer CTA ─────────────────────────────────────────── */}
            <section className="relative mt-32 py-32 border-t border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-orange-900/10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <RevealText type="words" className="text-3xl md:text-5xl lg:text-7xl font-light text-white mb-10 leading-tight">
                        Ready to embark on a journey of a lifetime?
                    </RevealText>
                    <Link
                        href="/contact-us"
                        className="inline-flex items-center justify-center px-10 py-5 rounded-full bg-linear-to-r from-orange-600 to-red-600 text-white font-medium tracking-widest uppercase text-sm transition-all duration-500 hover:-translate-y-1"
                    >
                        Apply Now
                    </Link>
                </div>
            </section>

            <style jsx>{`
                @keyframes scroll-down {
                    0% { transform: translateY(-100%); }
                    50% { transform: translateY(100%); }
                    100% { transform: translateY(100%); }
                }
                .writing-vertical-rl {
                    writing-mode: vertical-rl;
                }
            `}</style>
        </main>
        </>
    );
}
