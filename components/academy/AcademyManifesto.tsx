"use client";

import AnimatedText from "@/components/animation/AnimatedText";

export function AcademyManifesto() {
    return (
        <section className="relative bg-[#0A0A0A] px-6 py-32 md:py-14">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">
                Why we exist
            </p>

            <AnimatedText className="mx-auto mt-6 max-w-5xl text-center text-2xl leading-snug md:text-[2.8rem]">
                We spend the prime years of our lives preparing for a career — and almost no time preparing for what actually decides its quality: our mind, our health, our relationships, our purpose. Ancient AI teaches what school left out.
            </AnimatedText>

            {/* <blockquote className="mx-auto mt-20 max-w-3xl border-l-2 border-[#f15906]/50 pl-6 text-xl italic text-white/80 md:text-2xl">
                &ldquo;We&apos;re here to translate wisdom that has guided humanity for millennia into a practice for the modern mind — and to help a generation actually live it.&rdquo;
                <footer className="mt-4 text-sm not-italic text-white/50">
                    — Ancient AI Academy
                </footer>
            </blockquote> */}
        </section>
    );
}
