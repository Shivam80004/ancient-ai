"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import RevealText from "@/components/animation/RevealText";

gsap.registerPlugin(ScrollTrigger);

type Card = {
    index: string;
    tag: string;
    title: string;
    body: string;
    image: string;
};

const CARDS: Card[] = [
    {
        index: "01",
        tag: "Gamified transformation",
        title: "Learning you actually finish",
        body: "Semesters, courses, points, streaks, a live leaderboard, and real rewards. Progress you can see turns intention into momentum.",
        image: "/gellery-img/gallery-img-9.jpg",
    },
    {
        index: "02",
        tag: "Personalized by your Life Audit",
        title: "A path shaped around you",
        body: "A short, adaptive audit reads where you are and points you to your archetype and the one practice to start with — no guesswork.",
        image: "/gellery-img/gallery-img-4.jpeg",
    },
    {
        index: "03",
        tag: "Wisdom that has lasted millennia",
        title: "The oldest playbook for living",
        body: "Rooted in the Bhagavad Gita and Vedic thought, translated into language and tools that make sense for a modern mind.",
        image: "/gellery-img/gallery-img-8.png",
    },
    {
        index: "04",
        tag: "Grow together, not alone",
        title: "Belonging is the accelerator",
        body: "Ancient Vibe, mentorship, and sacred retreats. The people around you are the multiplier on everything you learn.",
        image: "/gellery-img/gallery-img-2.webp",
    },
];

export function AcademyDifference() {
    const rootRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>("[data-difference-card]");
            cards.forEach((card, i) => {
                // Every card except the last dims + scales down slightly as the
                // next card scrolls up over it, for a layered "stacking" feel.
                if (i === cards.length - 1) return;
                gsap.to(card, {
                    scale: 0.94,
                    opacity: 0.55,
                    ease: "none",
                    scrollTrigger: {
                        trigger: cards[i + 1],
                        start: "top 80%",
                        end: "top 30%",
                        scrub: true,
                    },
                });
            });
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={rootRef} className="relative bg-[#0A0A0A] px-6 pb-32">
            {/* Intro header */}
            <div className="mx-auto mb-16 max-w-2xl text-center md:mb-24">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">
                    The Ancient AI difference
                </p>
                <RevealText
                    as="h2"
                    type="chars"
                    className="mt-3 text-3xl font-semibold md:text-5xl"
                    style={{ fontFamily: "var(--font-oswald)" }}
                >
                    Not another video library
                </RevealText>
                <p className="mx-auto mt-4 max-w-xl text-white/60">
                    Four reasons people call this a way of life, not an app.
                </p>
            </div>

            {/* Stacking cards */}
            <div className="mx-auto max-w-5xl">
                {CARDS.map((card, i) => (
                    <div
                        key={card.index}
                        data-difference-card
                        className="sticky mb-8 last:mb-0"
                        style={{ top: `calc(6rem + ${i * 2.5}rem)` }}
                    >
                        <article className="grid overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#221b17] to-[#0d0a09] shadow-[0_25px_70px_rgba(0,0,0,0.5)] md:grid-cols-2">
                            {/* Text */}
                            <div className="order-2 flex flex-col justify-center p-8 md:order-1 md:p-12">
                                <span
                                    className="text-5xl font-bold text-[#f15906]/30 md:text-7xl"
                                    style={{ fontFamily: "var(--font-oswald)" }}
                                >
                                    {card.index}
                                </span>
                                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f15906]">
                                    {card.tag}
                                </p>
                                <h3
                                    className="mt-2 text-2xl font-semibold text-white md:text-4xl"
                                    style={{ fontFamily: "var(--font-oswald)" }}
                                >
                                    {card.title}
                                </h3>
                                <p className="mt-4 leading-relaxed text-white/70">{card.body}</p>
                            </div>

                            {/* Image */}
                            <div className="relative order-1 min-h-[240px] md:order-2 md:min-h-[380px]">
                                <Image
                                    src={card.image}
                                    alt=""
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                />
                            </div>
                        </article>
                    </div>
                ))}
            </div>
        </section>
    );
}
