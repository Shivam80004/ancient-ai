
'use client';
import React from 'react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger, Flip } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger, Flip);

const ScalingVideoSection = ({
    videoSrc = "/videos/empty.mp4",
    eyebrowText = "[ Why ANCIENT AI? ]",
    headerTitle = "Everything Works. Yet, Something’s Missing ?",
    secondaryTitle = "This is where AncientAI matters To Reclaim Your Life. But with few Upgrades (No credit cards required!)",
    showSvgOverlay = true,
}) => {
    const wrapperRefs = useRef([]);
    const targetRef = useRef(null);
    const timelineRef = useRef(null);
    const header1Ref = useRef(null);
    const header2Ref = useRef(null);
    const mainContainerRef = useRef(null);
    const marqueeSectionRef = useRef(null);

    React.useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const wrapperElements = wrapperRefs.current.filter(Boolean);
            const targetEl = targetRef.current;

            if (!wrapperElements.length || !targetEl) return;

            // 1. Flip Timeline (Scaling Video)
            const createFlipTimeline = () => {
                if (timelineRef.current) {
                    timelineRef.current.kill();
                    gsap.set(targetEl, { clearProps: "all" });
                }

                timelineRef.current = gsap.timeline({
                    scrollTrigger: {
                        trigger: wrapperElements[0],
                        start: "center center",
                        endTrigger: wrapperElements[wrapperElements.length - 1],
                        end: "center center",
                        scrub: 0.25,
                    },
                });

                wrapperElements.forEach((element, index) => {
                    const nextIndex = index + 1;
                    if (nextIndex < wrapperElements.length) {
                        const nextWrapperEl = wrapperElements[nextIndex];
                        timelineRef.current.add(
                            Flip.fit(targetEl, nextWrapperEl, {
                                duration: 1,
                                ease: "none",
                            })
                        );
                    }
                });
            };

            createFlipTimeline();

            // 2. Header Reveal Animations
            [header1Ref.current, header2Ref.current].forEach((header) => {
                if (!header) return;
                const words = header.querySelectorAll('.reveal-word-2');
                gsap.fromTo(words,
                    { y: 20, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        stagger: 0.05,
                        duration: 3.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: header,
                            start: "top 85%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            });

            // 3. Three-Line Scroll Animation
            if (marqueeSectionRef.current) {
                const line1 = marqueeSectionRef.current.querySelector('.line-1');
                const line2 = marqueeSectionRef.current.querySelector('.line-2');
                const line3 = marqueeSectionRef.current.querySelector('.line-3');

                if (line1 && line2 && line3) {
                    // Check if mobile
                    const isMobile = window.innerWidth < 768;

                    // Line 1 - from right
                    gsap.fromTo(line1,
                        { x: '100%', opacity: 0 },
                        {
                            x: '0%',
                            opacity: 1,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: marqueeSectionRef.current,
                                start: isMobile ? "top 90%" : "top 70%",
                                end: isMobile ? "top 70%" : "top 40%",
                                scrub: 1,
                            }
                        }
                    );

                    // Line 2 - from left
                    gsap.fromTo(line2,
                        { x: '-100%', opacity: 0 },
                        {
                            x: '0%',
                            opacity: 1,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: marqueeSectionRef.current,
                                start: isMobile ? "top 70%" : "top 50%",
                                end: isMobile ? "top 50%" : "top 20%",
                                scrub: 1,
                            }
                        }
                    );

                    // Line 3 - from right
                    gsap.fromTo(line3,
                        { x: '100%', opacity: 0 },
                        {
                            x: '0%',
                            opacity: 1,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: marqueeSectionRef.current,
                                start: isMobile ? "top 50%" : "top 30%",
                                end: isMobile ? "top 30%" : "top 0%",
                                scrub: 1,
                            }
                        }
                    );
                }
            }

            // Handle resize
            let resizeTimer;
            const handleResize = () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(createFlipTimeline, 100);
            };
            window.addEventListener("resize", handleResize);

            return () => {
                window.removeEventListener("resize", handleResize);
            };
        });

        return () => ctx.revert();
    }, []);

    // Helper to set refs
    const setWrapperRef = (index) => (el) => {
        wrapperRefs.current[index] = el;
    };

    return (
        <div className="scaling-video-wrapper">
            <div ref={mainContainerRef} className="relative overflow-hidden bg-black">
                {/* Header Section */}
                <section className="relative flex min-h-screen flex-col items-center justify-center gap-12 px-[5vw] pb-[20vh] pt-[25vh]">
                    {/* Eyebrow */}
                    <span className="text-xl font-normal uppercase text-white">
                        {eyebrowText}
                    </span>

                    <h3 ref={header1Ref} className="text-4xl md:text-7xl font-light text-white text-center mb-2">
                        <span className="reveal-word-2 inline-block">Everything</span>&nbsp;
                        <span className="reveal-word-2 inline-block">Works </span> <br />
                        <span className="reveal-word-2 inline-block font-semibold">Yet,</span>&nbsp;
                        <span className="reveal-word-2 inline-block font-semibold">Something’s</span>&nbsp;
                        <span className="reveal-word-2 inline-block bg-clip-text font-semibold leading-[1.3]">Missing</span>
                        <span className="reveal-word-2 inline-block font-semibold">?</span>
                    </h3>

                    {/* Small Box Container */}
                    <div className="relative w-80 rounded-2xl max-md:w-60">
                        {/* Aspect Ratio Spacer (16:9) */}
                        <div className="pt-[56.25%]" />

                        {/* Video Wrapper */}
                        <div
                            ref={setWrapperRef(0)}
                            className="absolute left-0 top-0 h-full w-full"
                        >
                            {/* Scaling Video Target */}
                            <div
                                ref={targetRef}
                                className="absolute left-0 top-0 flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-amber-500 will-change-transform [isolation:isolate] [transform:translateX(0)_rotate(0.001deg)] [backface-visibility:hidden]"
                            >
                                {/* Video */}
                                <video
                                    autoPlay
                                    muted
                                    playsInline
                                    loop
                                    className="absolute h-full w-full rounded-[inherit] object-cover scale-[1.3]"
                                >
                                    <source src={videoSrc} type="video/mp4" />
                                </video>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Video Section */}
                <section className="relative flex flex-col items-center justify-center gap-[25vh] px-[5vw] pb-12 md:pb-[25vh]">
                    {/* Big Box Container */}
                    <div className="relative w-full rounded-2xl">
                        {/* Aspect Ratio Spacer (16:9) */}
                        <div className="pt-[56.25%]" />

                        {/* Video Wrapper (target for Flip) */}
                        <div
                            ref={setWrapperRef(1)}
                            className="absolute left-0 top-0 h-full w-full"
                        />
                    </div>

                    {/* Secondary Title */}
                    <h3 ref={header2Ref} className="text-2xl md:text-6xl font-light text-white text-center mb-2">
                        <span className="reveal-word-2 inline-block">This</span>&nbsp;
                        <span className="reveal-word-2 inline-block">is</span>&nbsp;
                        <span className="reveal-word-2 inline-block">where</span>&nbsp;
                        <span className="reveal-word-2 inline-block font-semibold text-[#ff7b00]">AncientAI</span>&nbsp;
                        <span className="reveal-word-2 inline-block">Matters</span>&nbsp;
                        <span className="reveal-word-2 inline-block font-semibold">To Reclaim Your Life.<br /></span> <br />
                        <span className="reveal-word-2 inline-block">But with few Upgrades</span> <br />
                        <span className="reveal-word-2 inline-block text-gray-500 text-xl">(No credit cards required!)</span>
                    </h3>
                </section>
                <section ref={marqueeSectionRef} className="relative md:min-h-[60vh] w-full overflow-hidden flex items-center justify-center md:-mt-32 z-0">
                    <div className="w-full max-w-7xl mx-auto px-8 space-y-8">
                        {/* Line 1 - from right */}
                        <div className="line-1 text-center overflow-hidden">
                            <h2 className="text-2xl md:text-5xl lg:text-6xl leading-[0.9] font-semibold"
                                style={{
                                    background: 'linear-gradient(0deg, #000000 -50%, #fff 50%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Not as Belief
                            </h2>
                        </div>

                        {/* Line 2 - from left */}
                        <div className="line-2 text-center overflow-hidden">
                            <h2 className="text-2xl md:text-5xl lg:text-6xl leading-normal font-semibold rounded-2xl w-fit mx-auto px-3 md:px-7 text-white"
                                style={{
                                    background: 'linear-gradient(261.26deg, #fb1e01 -11.86%, #fc964c -5.96% 5.45%, #f62003 30.99%, #f61f0362 62.85%, #f62003 101.39%, #fd7c34 103.82%)',
                                }}
                            >
                                Not as Religious Dogma
                            </h2>
                        </div>

                        {/* Line 3 - from right */}
                        <div className="line-3 text-center overflow-hidden">
                            <h2 className="text-2xl md:text-5xl lg:text-6xl font-semibold text-white "
                                style={{
                                    background: 'linear-gradient(0deg, #000000 -50%, #fff 50%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Simplified & Translated for Modern Life
                            </h2>
                        </div>
                    </div>
                </section>
            </div>
        </div >
    );
};

export default ScalingVideoSection;
