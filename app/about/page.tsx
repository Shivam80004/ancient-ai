'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollIconRef = useRef<HTMLDivElement>(null);
    const pinnedSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Floating animation for scroll icon - keep simple animations in useEffect or include in context
        // Moving this into the context below for better cleanup management
    }, []);

    // Use useLayoutEffect for GSAP ScrollTrigger to ensure DOM is ready and calculations are correct
    // preventing potential 'removeChild' errors during React updates while pinned
    React.useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Floating animation for scroll icon
            gsap.to(scrollIconRef.current, {
                y: 10,
                opacity: 0.5,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });

            // Section 1: Title Reveal
            const tlHeader = gsap.timeline({
                scrollTrigger: {
                    trigger: ".about-header",
                    start: "top center",
                    end: "bottom center",
                    toggleActions: "play none none reverse"
                }
            });

            tlHeader.from(".about-title", {
                y: 100,
                opacity: 0,
                duration: 1.2,
                ease: "power4.out"
            })
                .from(".about-subtitle", {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out"
                }, "-=0.8");

            // Section 2: The Three Things (Pinning & Discovery)
            // Using ref instead of document.querySelector for better React safety
            const tlDeep = gsap.timeline({
                scrollTrigger: {
                    trigger: pinnedSectionRef.current,
                    start: "top top",
                    end: "+=400%",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1
                }
            });

            // "Everyone is searching..."
            tlDeep.from(".search-intro", {
                scale: 0.8,
                opacity: 0,
                duration: 1
            });

            // Eternity
            tlDeep.to(".search-intro", { opacity: 0, scale: 1.1, duration: 0.8, delay: 0.5 })
                .from(".eternity-block", { y: 100, opacity: 0, duration: 1.2, ease: "power4.out" })
                .from(".eternity-desc", { y: 20, opacity: 0, duration: 0.8 }, "-=0.8")
                .to(".eternity-block", { opacity: 0, scale: 0.8, duration: 0.8, delay: 1.5 });

            // Knowledge
            tlDeep.from(".knowledge-block", { x: 100, opacity: 0, duration: 1.2, ease: "power4.out" })
                .from(".knowledge-desc", { y: 20, opacity: 0, duration: 0.8 }, "-=0.8")
                .to(".knowledge-block", { opacity: 0, x: -100, duration: 0.8, delay: 1.5 });

            // Bliss
            tlDeep.from(".bliss-block", { y: -100, opacity: 0, duration: 1.2, ease: "power4.out" })
                .from(".bliss-desc", { y: 20, opacity: 0, duration: 0.8 }, "-=0.8")
                .to(".bliss-block", { opacity: 0, scale: 1.5, duration: 0.8, delay: 1.5 });

            // Conclusion (Sat Cit Ananda)
            tlDeep.from(".ancient-sum", { scale: 0.3, opacity: 0, duration: 1.5, ease: "expo.out" })
                .from(".diagnosis", { opacity: 0, y: 30, duration: 1 }, "-=0.5")
                .to(".ancient-sum", { opacity: 0, y: -50, duration: 1, delay: 2 }); // Long pause here

            // Final Modern Life Contrast
            tlDeep.from(".modern-contrast-title", { opacity: 0, y: 30, duration: 1 })
                .from(".modern-contrast-sub", { opacity: 0, y: 20, duration: 1 }, "-=0.5")
                .from(".delivers-none", {
                    opacity: 0,
                    scale: 1.5,
                    filter: "blur(20px)",
                    color: "#ff7b00",
                    textShadow: "0 0 40px rgba(255,123,0,0.8)",
                    duration: 2,
                    ease: "power4.out"
                }, "+=0.8");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const sectionTitle = "text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4";
    const descText = "text-xl md:text-3xl font-light text-white/60 italic leading-relaxed";

    return (
        <main ref={containerRef} className="bg-black text-white selection:bg-[#ff7b00] selection:text-black">
            {/* Header Hero */}
            <section className="about-header min-h-screen flex flex-col items-center justify-center relative px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#2a150d_0%,#000000_100%)] opacity-50"></div>

                <div className="relative z-10 text-center uppercase">
                    <h1 className="about-title text-[12vw] font-black leading-[0.85] tracking-tight mb-8">
                        ABOUT <br /> <span className="text-[#ff7b00]">US</span>
                    </h1>
                    <h2 className="about-subtitle text-xl md:text-3xl font-medium tracking-[0.3em] text-white/40">
                        The Universal Search
                    </h2>
                </div>

                <div ref={scrollIconRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
                    <span className="text-[10px] tracking-[0.2em] uppercase">Scroll to dive</span>
                    <div className="w-px h-12 bg-white/40"></div>
                </div>
            </section>

            {/* Immersive Explanation Section Wrapper - Essential for GSAP Pinning Safety */}
            <div>
                <section ref={pinnedSectionRef} className="universal-search-section relative min-h-screen w-full flex items-center justify-center bg-black">
                    {/* Background Textures */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                    </div>

                    <div className="container mx-auto px-6 relative z-10 h-full flex items-center justify-center">

                        {/* Everyone is searching... */}
                        <div className="search-intro absolute text-center max-w-4xl">
                            <h3 className="text-4xl md:text-6xl font-medium leading-tight">
                                Everyone is searching for the <br />
                                <span className="text-[#ff7b00] font-black">SAME THREE THINGS.</span>
                            </h3>
                        </div>

                        {/* Eternity */}
                        <div className="eternity-block absolute text-center">
                            <h2 className={`${sectionTitle} text-white`}>Eternity.</h2>
                            <p className={`eternity-desc ${descText}`}>To matter beyond this moment.</p>
                        </div>

                        {/* Knowledge */}
                        <div className="knowledge-block absolute text-center">
                            <h2 className={`${sectionTitle} text-[#3b82f6]`}>Knowledge.</h2>
                            <p className={`knowledge-desc ${descText}`}>To understand what’s really going on.</p>
                        </div>

                        {/* Bliss */}
                        <div className="bliss-block absolute text-center">
                            <h2 className={`${sectionTitle} text-[#ffd700]`}>Bliss.</h2>
                            <p className={`bliss-desc ${descText}`}>To live without the constant inner friction.</p>
                        </div>

                        {/* Ancient Diagnosis */}
                        <div className="ancient-sum absolute text-center max-w-5xl">
                            <h2 className="text-4xl md:text-7xl font-bold mb-8">
                                Ancient traditions called this <br />
                                <span className="text-[#ff7b00]">Sat. Cit. Ānanda.</span>
                            </h2>
                            <p className="diagnosis text-xl md:text-3xl text-white/50">
                                Not as philosophy — but as a <br />
                                <span className="text-white border-b-2 border-white/20">diagnosis of the human condition.</span>
                            </p>
                        </div>

                        {/* Modern Contrast */}
                        <div className="modern-contrast absolute text-center">
                            <h3 className="modern-contrast-title text-3xl md:text-5xl font-light mb-4 text-white/80">
                                Modern life promises all three.
                            </h3>
                            <p className="modern-contrast-sub text-lg md:text-xl text-white/40 mb-12 italic">
                                (Pause)
                            </p>
                            <h2 className="delivers-none text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none">
                                Delivers none <br /> consistently.
                            </h2>
                        </div>

                    </div>
                </section>
            </div>

            {/* Final Contact/CTA Area */}
            <section className="py-40 px-6 text-center bg-black border-t border-white/5">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to reclaim focus?</h2>
                    <p className="text-white/40 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
                        Ancient AI is the bridge between timeless wisdom and current technology.
                        No credit cards needed — just your attention.
                    </p>
                    <button className="px-12 py-5 bg-[#ff7b00] text-black font-bold rounded-full hover:scale-105 transition-transform duration-300">
                        START THE JOURNEY
                    </button>
                </div>
            </section>

        </main>
    );
};

export default AboutPage;
