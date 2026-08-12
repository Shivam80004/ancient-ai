import React from 'react';
import RevealText from '@/components/animation/RevealText';
import MotionPathGallery from '@/components/trips/MotionPathGallery';
import TripsCTA from '@/components/trips/TripsCTA';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Retreats & Spiritual Journeys',
    description: 'Explore spiritual journeys and retreats across sacred places.',
    alternates: {
        canonical: '/retreats',
    }
};

export default function TripsPage() {
    return (
        <main className="min-h-screen bg-black">

            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <section className="absolute top-0 left-0 right-0 h-screen overflow-hidden flex items-center justify-center">

                {/* Video background */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <video
                        src="https://res.cloudinary.com/dh3fdtkbe/video/upload/v1776500789/trips_pthio6.mp4"
                        autoPlay loop muted playsInline
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Bottom-to-top dark fade */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Large title — mix-blend-difference gives the overlay invert effect */}
                <div className="absolute mix-blend-difference inset-0 z-20 flex items-center justify-center -translate-y-[10%]">
                    <RevealText
                        as="h1"
                        type="chars"
                        className="text-5xl md:text-[10rem] font-medium text-white tracking-tight text-center px-4"
                        stagger={0.03}
                    >
                        Retreats
                    </RevealText>
                </div>

                {/* Subtitle — centered below the title */}
                <div className="absolute mix-blend-difference md:top-1/2 top-[45%] left-0 right-0 z-20 flex items-center justify-center px-4">
                    <RevealText
                        type="words"
                        className="text-xl md:text-2xl text-white/80 font-light leading-relaxed text-center max-w-xl"
                        stagger={0.05}
                        delay={0.6}
                    >
                        Explore spiritual journeys and retreats
                    </RevealText>
                </div>
            </section>

            <MotionPathGallery />

            <TripsCTA />
        </main>
    );
}