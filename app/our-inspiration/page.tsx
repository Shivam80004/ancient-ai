import React from 'react';
import PageHero from '@/components/ui/PageHero';
import RevealText from '@/components/animation/RevealText';
import Image from 'next/image';
import ParallaxImage from '@/components/animation/ParallaxImage';
import PrabhupadaTimeline from '@/components/inspiration/PrabhupadaTimeline';

export default function InspirationPage() {
    return (
        <main className="bg-black min-h-screen text-white">
            <div className="relative min-h-[100vh] flex items-center justify-center">
                {/* Video background */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <ParallaxImage src="/images/hdsp.png" yMove={80} alt="HDSP" className="w-full h-full object-cover" />
                </div>

                <div className="absolute inset-0 left-1/2 transform -translate-x-[10%] z-10 flex items-center justify-center">
                    <RevealText
                        type="chars"
                        className="text-5xl md:text-[5rem] font-medium text-white tracking-tight text-center px-4"
                        stagger={0.03}
                    >
                        Our Inspiration
                    </RevealText>
                </div>

                <div className="absolute inset-0 top-1/2 transform -translate-y-[30%] translate-x-[45%] flex items-center justify-center z-20 text-center px-4 max-w-2xl mx-auto">
                    <RevealText
                        type="words"
                        className="text-xl md:text-3xl text-white/80 font-normal leading-relaxed"
                        stagger={0.01}
                        delay={0.5}
                    >
                        A.C. Bhaktivedanta Swami Prabhupada
                    </RevealText>
                </div>
            </div>

            <PrabhupadaTimeline />
            <section className="py-20 px-4 md:px-8 max-w-4xl mx-auto space-y-12">
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-semibold text-orange-500">Ancient Truths for Modern Minds</h2>
                    <p className="text-lg md:text-xl font-light leading-relaxed text-white/80">
                        The Gaura Vāṇī Academy is inspired by the timeless wisdom of the Vedas, particularly the Bhagavad Gita and Srimad Bhagavatam. Our mission is to translate these ancient truths into a language that resonates with the modern mind, without diluting the essence.
                    </p>
                    <p className="text-lg md:text-xl font-light leading-relaxed text-white/80">
                        We believe that real strength—physical, mental, and spiritual—comes from understanding our true identity. The "GYM" (Gita for Young Minds) concept is built on this foundation: training the self to face the world with resilience, clarity, and compassion.
                    </p>
                </div>

                <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                    <h3 className="text-2xl font-semibold mb-4 text-white">Our Motto</h3>
                    <p className="text-xl italic text-orange-200">
                        "Worst thing we can do to you is to make you a Master of Self Control & Eternity of this short life."
                    </p>
                </div>
            </section>
        </main>
    );
}
