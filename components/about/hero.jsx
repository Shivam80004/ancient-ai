'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

const Hero = () => {
    const containerRef = useRef(null);
    const itemsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: "power4.out" }
            });

            // Initial states
            gsap.set(".hero-title-word", { y: "150%", rotate: 10, opacity: 0 });
            gsap.set(".hero-sub-text", { y: 30, opacity: 0 });
            gsap.set(".hero-divider", { scaleX: 0 });
            gsap.set(".hero-bg-img", { scale: 1.15, filter: "brightness(0.2) blur(10px)" });

            // Animation sequence
            tl.to(".hero-bg-img", {
                scale: 1,
                filter: "brightness(0.4) blur(0px)",
                duration: 2.5,
                ease: "expo.out"
            })
                .to(".hero-sub-text", {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.15,
                    delay: -1.9
                })
                .to(".hero-title-word", {
                    y: "0%",
                    rotate: 0,
                    opacity: 1,
                    duration: 1.6,
                    stagger: 0.1,
                    delay: -1.8
                })
                .to(".hero-divider", {
                    scaleX: 1,
                    duration: 1.2,
                    delay: -1
                });

            // Subtle Mouse Parallax
            const handleMouseMove = (e) => {
                const { clientX, clientY } = e;
                const xPos = (clientX / window.innerWidth - 0.5) * 30;
                const yPos = (clientY / window.innerHeight - 0.5) * 30;

                gsap.to(".hero-bg-img", {
                    x: xPos,
                    y: yPos,
                    duration: 2,
                    ease: "power2.out"
                });
            };

            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center font-poppins">
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/gellery-img/gallery-img-8.png"
                    alt="Atmospheric Background"
                    fill
                    className="hero-bg-img object-cover"
                    priority
                />
                {/* Vignette and Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/20 to-black" />
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />
            </div>

            <div className="relative z-10 w-full max-w-7xl px-6 md:px-12 mt-32 text-center pointer-events-none">
                {/* Intro Line */}
                <div className="overflow-hidden md:mb-6 mb-4">
                    <p className="hero-sub-text text-white/90 text-xs md:text-sm tracking-[0.4em] font-medium selection:bg-[#fb1e01]">
                        Everyone is looking for
                    </p>
                </div>

                {/* Main Headline */}
                <h1 className="flex flex-col items-center justify-center space-y-2 md:space-y-0">
                    <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-12">
                        {[
                            { label: "SAT", value: "Eternity" },
                            { label: "CIT", value: "Knowledge" },
                            { label: "ANANDA", value: "Bliss" }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="overflow-hidden">
                                    <span className="hero-title-word inline-block text-6xl md:text-7xl font-bold text-white uppercase px-3">
                                        {item.label}
                                    </span>
                                </div>
                                <div className="overflow-hidden mt-1">
                                    <span className="hero-sub-text inline-block text-[10px] md:text-xs text-[#fb1e01] tracking-[0.4em] font-black uppercase">
                                        {item.value}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </h1>

                {/* Divider Line */}
                <div className="hero-divider w-24 md:w-64 h-[2px] bg-linear-to-r from-transparent via-[#fb1e01] to-transparent mx-auto my-12 md:my-16" />

                {/* Brand Statement */}
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="overflow-hidden flex items-center justify-center flex-col md:flex-row">
                        <div className="hero-sub-text opacity-0">
                            <Image
                                src="/logo-plain.png"
                                alt="Ancient AI"
                                width={250}
                                height={60}
                                className="brightness-200 transform md:-translate-y-5.5 translate-y-0 -translate-x-0.5"
                            />
                        </div>
                        <p className="hero-sub-text text-lg md:text-2xl text-white font-light leading-relaxed max-w-8xl text-center">
                            empowers people to add these ingredients in their mundane, tasteless and artificial lives & design an <span className="text-[#fb1e01] font-semibold uppercase">AN EXTRAORDINARY LIFE with UNPARALLELED BLISS AND HIGHER PURPOSE</span>
                        </p>
                    </div>

                    {/* <div className="overflow-hidden">
                        <p className="hero-sub-text text-sm md:text-lg text-white/60 font-light leading-relaxed max-w-2xl mx-auto uppercase tracking-widest">
                            Unparalleled Bliss & Higher Purpose
                        </p>
                    </div> */}
                </div>
            </div>
        </section>
    );
};

export default Hero;