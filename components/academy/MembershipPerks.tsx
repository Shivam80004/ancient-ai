"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Perk = {
    number: string;
    title: string;
    variant: "light" | "ember" | "sienna" | "dark" | "glass";
    items: string[];
};

const PERKS: Perk[] = [
    {
        number: "1.",
        title: "Free Resources",
        variant: "glass",
        items: ["Guided readings", "Meditation audio", "Practice worksheets", "Curated library"],
    },
    {
        number: "2.",
        title: "Ancient Vibe",
        variant: "ember",
        items: ["Community feed", "Share your journey", "Connect with seekers", "Weekly prompts"],
    },
    {
        number: "3.",
        title: "Goodies",
        variant: "light",
        items: ["Branded merch", "Journals & tools", "Member kits", "Seasonal drops"],
    },
    {
        number: "4.",
        title: "Snack",
        variant: "sienna",
        items: ["Wholesome treats", "Retreat meals", "Ayurvedic snacks", "Chef curated"],
    },
    {
        number: "5.",
        title: "Premium Retreats",
        variant: "dark",
        items: ["Sacred locations", "Immersive stays", "Expert-led sessions", "All-inclusive access"],
    },
];

export default function MembershipPerks() {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const section = root.querySelector<HTMLElement>("[data-stacking-cards-init]");
        if (!section) return;

        const getTier = () => {
            const width = window.innerWidth;
            if (width <= 479) return "mobile-portrait";
            if (width <= 767) return "mobile-landscape";
            if (width <= 991) return "tablet";
            return "desktop";
        };

        const parseRotate = (attr: string) => {
            const fallback = [0, 4, -4];
            const values = (section.getAttribute(attr) || "")
                .split(",")
                .map((v) => parseFloat(v.trim()));
            return values.length >= 1 && values.every((v) => !isNaN(v)) ? values : fallback;
        };

        const parseAxis = (attr: string) => {
            const raw = section.getAttribute(attr);
            if (!raw) return ["0em", "0em", "0em"];
            const values = raw
                .split(",")
                .map((v) => v.trim())
                .filter((v) => v !== "");
            return values.length ? values : ["0em", "0em", "0em"];
        };

        const pulseElement = (targetEl: HTMLElement) => {
            const width = targetEl.offsetWidth;
            const height = targetEl.offsetHeight;
            const fontSize = parseFloat(getComputedStyle(targetEl).fontSize);
            const stretchPx = 1.5 * fontSize;
            const targetScaleX = (width + stretchPx) / width;
            const targetScaleY = (height - stretchPx * 0.33) / height;

            const tl = gsap.timeline();
            tl.to(targetEl, {
                scaleX: targetScaleX,
                scaleY: targetScaleY,
                duration: 0.1,
                ease: "power1.out",
            }).to(targetEl, {
                scaleX: 1,
                scaleY: 1,
                duration: 1,
                ease: "elastic.out(1, 0.3)",
            });
        };

        let build = () => {};

        build = () => {
            const tier = getTier();

            // clean prior triggers/tweens for this section
            ScrollTrigger.getAll().forEach((trigger) => {
                const t = trigger.trigger as Node | undefined;
                if (t && section.contains(t)) trigger.kill();
            });
            section.querySelectorAll<HTMLElement>("[data-stacking-card-target]").forEach((el) => {
                gsap.killTweensOf(el);
                gsap.set(el, { clearProps: "all" });
            });

            const isEnabled =
                (tier === "desktop" && section.dataset.stackingCardsDesktop === "true") ||
                (tier === "tablet" && section.dataset.stackingCardsTablet === "true") ||
                ((tier === "mobile-portrait" || tier === "mobile-landscape") &&
                    section.dataset.stackingCardsMobile === "true");

            if (!isEnabled) return;

            const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-stacking-card]"));
            if (!cards.length) return;

            const stickyTop = parseFloat(getComputedStyle(cards[0]).top) || 0;

            const rotateValues =
                tier === "desktop"
                    ? parseRotate("data-stacking-cards-desktop-rotate")
                    : tier === "tablet"
                        ? parseRotate("data-stacking-cards-tablet-rotate")
                        : parseRotate("data-stacking-cards-mobile-rotate");

            const xValues =
                tier === "desktop"
                    ? parseAxis("data-stacking-cards-desktop-x")
                    : tier === "tablet"
                        ? parseAxis("data-stacking-cards-tablet-x")
                        : parseAxis("data-stacking-cards-mobile-x");

            const yValues =
                tier === "desktop"
                    ? parseAxis("data-stacking-cards-desktop-y")
                    : tier === "tablet"
                        ? parseAxis("data-stacking-cards-tablet-y")
                        : parseAxis("data-stacking-cards-mobile-y");

            cards.forEach((card, index) => {
                const targetEl = card.querySelector<HTMLElement>("[data-stacking-card-target]");
                if (!targetEl) return;

                const rotate = rotateValues[index % rotateValues.length];
                const x = xValues[index % xValues.length];
                const y = yValues[index % yValues.length];

                gsap.set(targetEl, {
                    rotate: 0,
                    x: 0,
                    y: 0,
                    scale: 1,
                    zIndex: cards.length - index,
                });

                gsap.to(targetEl, {
                    rotate,
                    x,
                    y,
                    ease: "power1.in",
                    overwrite: "auto",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 75%",
                        end: `top-=${stickyTop} top`,
                        scrub: true,
                    },
                });

                ScrollTrigger.create({
                    trigger: card,
                    start: `top-=${stickyTop} top`,
                    onEnter: () => pulseElement(targetEl),
                });
            });

            ScrollTrigger.refresh();
        };

        build();

        // rebuild on breakpoint change
        let last = getTier();
        let timer: ReturnType<typeof setTimeout>;
        const onResize = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                const next = getTier();
                if (next !== last) {
                    last = next;
                    build();
                }
            }, 250);
        };
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach((trigger) => {
                const t = trigger.trigger as Node | undefined;
                if (t && section.contains(t)) trigger.kill();
            });
            section.querySelectorAll<HTMLElement>("[data-stacking-card-target]").forEach((el) => {
                gsap.killTweensOf(el);
            });
        };
    }, []);

    return (
        <div ref={rootRef} className="perks-wrap">
            <div className="perks-intro">
                <h2 className="perks-title">
                    More Than a <span>Course</span>
                </h2>
                <p className="perks-subtitle">
                    Membership opens the whole experience — everything you unlock as part of the Ancient AI
                    community.
                </p>
            </div>

            <section
                data-stacking-cards-init
                data-stacking-cards-desktop="true"
                data-stacking-cards-tablet="true"
                data-stacking-cards-mobile="true"
                data-stacking-cards-desktop-rotate="-5, 4, -3, 5, -4"
                data-stacking-cards-desktop-x="-30.5em, -15.5em, -1em, 15em, 30em"
                data-stacking-cards-desktop-y="8em, 8em, 8em, 8em, 8em"
                data-stacking-cards-tablet-rotate="-3, 3, -2, 3, -2"
                data-stacking-cards-tablet-x="-1em, 1em, -0.5em, 0.5em, 0em"
                data-stacking-cards-mobile-rotate="-2, 2, -1.5, 2, -1.5"
                data-stacking-cards-mobile-x="-0.5em, 0.5em, -0.25em, 0.25em, 0em"
                className="cards-stack"
            >
                <div className="perks-container">
                    <div className="cards-stack__collection">
                        <div data-stacking-card-stack className="cards-stack__list">
                            {PERKS.map((perk) => (
                                <div key={perk.title} data-stacking-card className="cards-stack__item">
                                    <div
                                        data-stacking-card-target
                                        className={`cards-stack-card is--${perk.variant}`}
                                    >
                                        <div className="cards-stack-card__start">
                                            <span className="cards-stack-card__number">{perk.number}</span>
                                        </div>
                                        <div className="cards-stack-card__end">
                                            <h3 className="cards-stack-card__h">{perk.title}</h3>
                                            <div className="cards-stack-card__services">
                                                {perk.items.map((item) => (
                                                    <p key={item} className="cards-stack-card__services-p">
                                                        {item}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <style jsx global>{`
                .perks-wrap {
                    background-color: #0a0a0a;
                    color: #f5f5f5;
                }

                .perks-intro {
                    max-width: 46em;
                    margin: 0 auto;
                    padding: 6em 1.5em 0;
                    text-align: center;
                }

                .perks-title {
                    font-size: clamp(2rem, 5vw, 3.75rem);
                    font-weight: 300;
                    letter-spacing: -0.02em;
                    margin: 0 0 0.4em;
                    color: #f5f5f5;
                }

                .perks-title span {
                    font-weight: 600;
                   
                }

                .perks-subtitle {
                    color: #a8b9b9;
                    font-size: clamp(0.95rem, 1.6vw, 1.15rem);
                    line-height: 1.6;
                    margin: 0;
                }

                .cards-stack {
                    padding-top: 8dvh;
                    padding-bottom: 15dvh;
                }

                .perks-container {
                    max-width: 90em;
                    margin-left: auto;
                    margin-right: auto;
                    padding-left: 2em;
                    padding-right: 2em;
                }

                .cards-stack__list {
                    grid-column-gap: 5em;
                    grid-row-gap: 5em;
                    flex-flow: column;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    display: flex;
                }

                .cards-stack__item {
                    flex: none;
                    width: 100%;
                    max-width: 25em;
                    position: sticky;
                    top: 5em;
                }

                .cards-stack-card {
                    // aspect-ratio: 2 / 3;
                    background-color: #17110f;
                    border: 1px solid rgba(245, 245, 245, 0.08);
                    box-shadow: 0 1.5em 3.5em rgba(0, 0, 0, 0.55);
                    border-radius: 2em;
                    flex-flow: column;
                    justify-content: space-between;
                    width: 100%;
                    padding: 2.5em;
                    display: flex;
                    color: #f5f5f5;
                    will-change: transform;
                }

                /* Frosted dark glass */
                .cards-stack-card.is--glass {
                    background-color: rgba(41, 27, 22, 0.72);
                    backdrop-filter: blur(8px);
                }

                /* Ember gradient */
                .cards-stack-card.is--ember {
                    color: #1a1614;
                    border-color: transparent;
                    background-image: linear-gradient(
                        261deg,
                        #fc964c -6%,
                        #f15906 45%,
                        #f62003 101%
                    );
                }

                /* Cream light */
                .cards-stack-card.is--light {
                    color: #1a1614;
                    background-color: #f5f0e8;
                    border-color: rgba(26, 22, 20, 0.08);
                }

                /* Burnt sienna */
                .cards-stack-card.is--sienna {
                    color: #f9efe9;
                    background-color: #8c4a32;
                    border-color: rgba(255, 255, 255, 0.12);
                }

                /* Deep dark */
                .cards-stack-card.is--dark {
                    color: #f5f5f5;
                    background-color: #1a1614;
                }

                .cards-stack-card__number {
                    font-size: 6.75em;
                    font-weight: 500;
                    line-height: 0.95;
                    opacity: 0.9;
                }

                .cards-stack-card__h {
                    letter-spacing: -0.04em;
                    margin-top: 0;
                    margin-bottom: 0.4em;
                    font-size: 2.75em;
                    font-weight: 600;
                    line-height: 0.95;
                }

                .cards-stack-card__services {
                    flex-flow: column;
                    justify-content: flex-end;
                    min-height: 9em;
                    display: flex;
                    opacity: 0.85;
                }

                .cards-stack-card__services-p {
                    letter-spacing: -0.01em;
                    margin-bottom: 0;
                    margin-top: 0;
                    font-size: 1.125em;
                    font-weight: 500;
                    line-height: 1.5;
                }

                @media screen and (max-width: 767px) {
                    .cards-stack-card {
                        font-size: 0.8em;
                    }
                }
            `}</style>
        </div>
    );
}
