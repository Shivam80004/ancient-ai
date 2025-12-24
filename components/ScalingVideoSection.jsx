
'use client';
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
    const textPathRef = useRef(null);
    const marqueeSectionRef = useRef(null);

    useEffect(() => {
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

            // 3. Marquee Pinning & Animation
            if (marqueeSectionRef.current && textPathRef.current) {
                gsap.to(textPathRef.current, {
                    attr: { startOffset: "-80%" },
                    ease: "none",
                    scrollTrigger: {
                        trigger: marqueeSectionRef.current,
                        start: "top 65%",
                        end: "+=200%",
                        scrub: 1,
                        pin: mainContainerRef.current, // Pin the whole section
                        anticipatePin: 1,
                    }
                });
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

    const content = " Not as belief -> Not as religious dogma -> Simplified & translated for modern life.";

    return (
        <div ref={mainContainerRef} className="relative overflow-hidden bg-black">
            {/* Header Section */}
            <section className="relative flex min-h-screen flex-col items-center justify-center gap-12 px-[5vw] pb-[20vh] pt-[25vh]">
                {/* Eyebrow */}
                <span className="text-xl font-normal uppercase text-[#ff7b00]">
                    {eyebrowText}
                </span>

                {/* Main Title */}
                <h1 ref={header1Ref} className="mb-1 mt-0 max-w-[15em] text-center text-[5em] font-medium leading-none max-md:text-[13.5vw]">
                    <span className="reveal-word-2 inline-block">Everything</span>&nbsp;
                    <span className="reveal-word-2 inline-block">Works.</span> <br />
                    <span className="reveal-word-2 inline-block">Yet,</span>&nbsp;
                    <span className="reveal-word-2 inline-block">Something’s</span>&nbsp;
                    <span className="reveal-word-2 inline-block bg-clip-text text-transparent bg-linear-to-r from-[#ffd700] to-[#ff7b00] leading-[1.3]">Missing</span>
                    <span className="reveal-word-2 inline-block text-[#ff7b00]/95">?</span>
                </h1>

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
            <section className="relative flex flex-col items-center justify-center gap-[25vh] px-[5vw] pb-[25vh]">
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
                <h1 ref={header2Ref} className="mb-1 mt-0 max-w-[18em] text-center text-[4em] font-medium leading-none max-md:text-[13.5vw] text-white">
                    <span className="reveal-word-2 inline-block">This</span>&nbsp;
                    <span className="reveal-word-2 inline-block">is</span>&nbsp;
                    <span className="reveal-word-2 inline-block">where</span>&nbsp;
                    <span className="reveal-word-2 inline-block text-[#ff7b00]">AncientAI</span>&nbsp;
                    <span className="reveal-word-2 inline-block ">Matters</span>&nbsp;
                    <span className="reveal-word-2 inline-block ">To Reclaim Your Life.<br /> But with few Upgrades</span> <br />
                    <span className="reveal-word-2 inline-block text-gray-500 text-3xl">(No credit cards required!)</span>
                </h1>
            </section>
            <section ref={marqueeSectionRef} className="relative h-[40vh] w-full overflow-hidden flex items-center justify-center -mt-32 z-0">
                <div className="absolute top-1/2 left-0 w-full -translate-y-1/2">
                    <svg
                        viewBox="0 0 1000 420"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-auto"
                    >
                        <path
                            id="radialPath"
                            d="M -500 210 S 0 100 500 210 S 1000 100 1500 210"
                            className="opacity-0"
                        />
                        <text className="fill-white/80 text-[2.1rem] font-medium tracking-wide uppercase [font-family:var(--font-poppins),sans-serif]">
                            <textPath
                                ref={textPathRef}
                                href="#radialPath"
                                startOffset="100%"
                                className="whitespace-nowrap"
                            >
                                {content}
                            </textPath>
                        </text>
                    </svg>
                </div>
            </section>
        </div >
    );
};

export default ScalingVideoSection;
