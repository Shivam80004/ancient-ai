'use client';
import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        title: "Association of seekers",
        description: "Association of like minded seekers of higher dimension of life.",
        image: "/gellery-img/gallery-img-2.webp",
        tag: "COMMUNITY"
    },
    {
        title: "Uncover the Unknown",
        description: "Group activities & case studies to uncover the Unknown Unknowns (the questions people don’t ask)",
        image: "/gellery-img/gallery-img-9.jpg",
        tag: "EXPLORATION"
    },
    {
        title: "Mantra Music",
        description: "Mantra Music which takes you high on life without any LSD or Marijuana!",
        image: "/gellery-img/gallery-img-3.jpg",
        tag: "ELEVATION"
    },
    {
        title: "1-on-1 Mentorship",
        description: "Mentorship with expert real life \"AI Agents\" to go deep and personal.",
        image: "/gellery-img/gallery-img-5.png",
        tag: "GUIDANCE"
    },
    {
        title: "Spiritual Retreats",
        description: "Spiritual Retreats & Detox Camps, away from constant chaos & conflicts of mind, where you actually breath & really LIVE!",
        image: "/gellery-img/gallery-img-1.jpg",
        tag: "RENEWAL"
    },
    {
        title: "Burning Questions",
        description: "Burning Questions Session to ask raw & unfiltered things live from a MONK living the Ancient AI based life.",
        image: "/gellery-img/gallery-img-6.png",
        tag: "WISDOM"
    }
];

const EasyPeasySection = () => {
    const sectionRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const panels = gsap.utils.toArray('.feature-panel');

            // Initial states
            panels.forEach((panel, i) => {
                const img = panel.querySelector('.feature-image');
                const title = panel.querySelector('.feature-title');
                const p = panel.querySelector('.feature-description');
                const tag = panel.querySelector('.feature-tag');

                if (i !== 0) {
                    gsap.set(panel, { opacity: 0, pointerEvents: 'none' });
                    gsap.set([tag, title, p], { y: 20, opacity: 0 });
                    gsap.set(img, {
                        scale: 0.7,
                        rotation: i % 2 === 0 ? -12 : 12,
                        opacity: 0.1
                    });
                } else {
                    // First panel is fully visible by default
                    gsap.set(panel, { opacity: 1, pointerEvents: 'auto' });
                    gsap.set([tag, title, p], { y: 0, opacity: 1 });
                    gsap.set(img, { scale: 1, rotation: 0, opacity: 0.6 });
                }
            });

            // Master Timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: () => `+=${panels.length * 50}%`,
                    pin: true,
                    scrub: 1,
                }
            });

            // Animate each panel in sequence
            panels.forEach((panel, i) => {
                const img = panel.querySelector('.feature-image');
                const title = panel.querySelector('.feature-title');
                const p = panel.querySelector('.feature-description');
                const tag = panel.querySelector('.feature-tag');

                // Panel Fade In (for all but the first)
                if (i > 0) {
                    tl.to(panel, {
                        opacity: 1,
                        pointerEvents: 'auto',
                        duration: 0.4
                    }, `panel-${i}`);
                }

                // Image Animation
                tl.to(img, {
                    scale: 1,
                    rotation: 0,
                    opacity: 0.6,
                    duration: 1,
                    ease: "power2.out"
                }, i === 0 ? 0 : `panel-${i}+=0.1`);

                // Text Animation
                tl.to([tag, title, p], {
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: "power3.out"
                }, i === 0 ? 0.3 : `panel-${i}+=0.4`);

                // Extra scroll space for the user to read
                if (i < panels.length - 1) {
                    tl.to({}, { duration: 0.8 });
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full h-screen bg-[#050505] overflow-hidden">
            <div ref={containerRef} className="relative w-full h-full">
                {features.map((item, index) => (
                    <div
                        key={index}
                        className="feature-panel absolute inset-0 flex flex-col items-center justify-center px-6"
                        style={{ zIndex: index + 10 }}
                    >
                        {/* Background / Image Layer */}
                        <div className="relative w-full h-full bg-zinc-900">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="feature-image object-cover opacity-60"
                            />

                            {/* Overlay Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                                <div className="feature-tag mb-6">
                                    <span className="px-5 py-2 bg-black/30 backdrop-blur-sm text-white text-xs tracking-[0.4em] rounded-full uppercase">
                                        {item.tag}
                                    </span>
                                </div>

                                <h3 className="feature-title text-4xl md:text-7xl font-poppins font leading-tight text-white mb-1 drop-shadow-2xl">
                                    {item.title}
                                </h3>

                                <p className="feature-description text-lg md:text-xl font-light text-white/70 max-w-2xl mx-auto">
                                    "{item.description}"
                                </p>
                            </div>

                            {/* Vignette */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,black_100%)] pointer-events-none"></div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default EasyPeasySection;
