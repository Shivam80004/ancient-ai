"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import RevealText from "@/components/animation/RevealText";
import MagneticButton from "@/components/ui/MagneticButton";

export function AcademyHero() {
    return (
        <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black px-6">
            {/* Background */}
            <div aria-hidden className="absolute inset-0">
                <Image
                    src="/gellery-img/gallery-img-8.png"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover opacity-40"
                />
            </div>
            <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0A0A0A]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -top-24 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(241,89,6,0.18),_transparent_70%)] blur-3xl"
            />

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-4xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">
                    Ancient AI Academy
                </p>
                <RevealText
                    as="h1"
                    type="chars"
                    className="mt-4 text-4xl md:text-6xl lg:text-7xl"
                >
                    The education our schools forgot
                </RevealText>
                <RevealText
                    type="words"
                    delay={0.3}
                    className="mx-auto mt-6 max-w-2xl text-base text-white/70 md:text-xl"
                >
                    Being human is more than what the system taught you. We teach the art of actually living — for the mind, body, and soul.
                </RevealText>
                <div className="mt-10 flex justify-center">
                    <MagneticButton text="Begin your journey" link="/signup" />
                </div>
            </div>
        </section>
    );
}
