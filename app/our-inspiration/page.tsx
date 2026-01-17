import React from 'react';
import PageHero from '@/components/ui/PageHero';

export default function InspirationPage() {
    return (
        <main className="bg-black min-h-screen text-white">
            <PageHero
                title="Our Inspiration"
                subtitle="Walking in the footsteps of the great Acaryas."
                image="/images/hero-inspiration.jpg"
            />

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
