'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DeepLayerSection = () => {
    const sectionRef = useRef(null);
    const bgRef = useRef(null);

    // Refs for text layers
    const layer1Ref = useRef(null);
    const layer2Ref = useRef(null);
    const layer3Ref = useRef(null);
    const layer4Ref = useRef(null);
    const layer5Ref = useRef(null);
    const layer6Ref = useRef(null);

    // Use useLayoutEffect for GSAP ScrollTrigger to ensure DOM is ready and calculations are correct
    // preventing potential 'removeChild' errors during React updates while pinned
    React.useLayoutEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=600%",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                }
            });

            // Initial Setup: Ensure all layers except first are hidden and scaled down
            const layers = [layer2Ref.current, layer3Ref.current, layer4Ref.current, layer5Ref.current, layer6Ref.current];
            gsap.set(layers, { autoAlpha: 0, scale: 0.5 });
            gsap.set(layer1Ref.current, { autoAlpha: 1, scale: 1 });
            gsap.set(layer6Ref.current, { autoAlpha: 0, scale: 1, });

            // Helper for transition: Current Layer Out -> Next Layer In
            const transitionLayer = (current, next, bgGradient) => {

                if (layer1Ref.current == current) {

                    tl.to(current, {
                        scale: 1, // Zoom out effect
                        y: -100,
                        autoAlpha: 0,
                        duration: 2,
                        ease: "power2.inOut"
                    })
                        .to(next, {
                            scale: 1,
                            autoAlpha: 1,
                            duration: 2,
                            ease: "power2.inOut"
                        }, "-=1.5"); // Overlap significantly

                    // if (bgGradient) {
                    //     tl.to(bgRef.current, {
                    //         background: bgGradient,
                    //         duration: 2
                    //     }, "<");
                    // }
                }
                else {

                    tl.to(current, {
                        scale: 3, // Zoom out effect
                        autoAlpha: 0,
                        duration: 2,
                        ease: "power2.inOut"
                    })
                        .to(next, {
                            scale: 1,
                            autoAlpha: 1,
                            duration: 2,
                            ease: "power2.inOut"
                        }, "-=1.5"); // Overlap significantly

                    // if (bgGradient) {
                    //     tl.to(bgRef.current, {
                    //         background: bgGradient,
                    //         duration: 2
                    //     }, "<");
                    // }
                }

            };

            // Sequence
            // 1. Forward -> Deep
            transitionLayer(layer1Ref.current, layer2Ref.current, null);

            // 2. Deep -> Body
            transitionLayer(layer2Ref.current, layer3Ref.current, "radial-gradient(circle at center, #2a150d 0%, #000000 100%)");

            // 3. Body -> Mind
            transitionLayer(layer3Ref.current, layer4Ref.current, "radial-gradient(circle at center, #0d1a2a 0%, #000000 100%)");

            // 4. Mind -> Self
            transitionLayer(layer4Ref.current, layer5Ref.current, "radial-gradient(circle at center, #2a220d 0%, #000000 100%)");

            // 5. Self -> Reality
            transitionLayer(layer5Ref.current, layer6Ref.current, "radial-gradient(circle at center, #000000 0%, #000000 100%)");

            // Stamp Animation
            const stamps = layer6Ref.current.querySelectorAll('.stamp-effect');
            tl.from(stamps, {
                scale: 4,
                opacity: 0,
                rotation: () => (Math.random() - 0.5) * 30,
                stagger: 0.5,
                duration: 0.8,
                ease: "power4.in"
            }, "+=0.2");

            // Slam/Shake effect when each stamp hits
            stamps.forEach((stamp, i) => {
                tl.to(layer6Ref.current, {
                    x: (Math.random() - 0.5) * 10,
                    y: (Math.random() - 0.5) * 10,
                    duration: 0.1,
                    ease: "rough",
                }, ">-0.1");
                tl.to(layer6Ref.current, { x: 0, y: 0, duration: 0.1 });
            });

            tl.to({}, { duration: 2 });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const textBase = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-4";

    return (
        <div className="deep-layer-wrapper">
            <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-black text-white">
                <div ref={bgRef} className="absolute inset-0 transition-colors duration-1000"
                    style={{
                        background: "radial-gradient(circle at 50% 200%, #0a0a0a, #0a0a0a 60%, #0A0A0A00 88%), linear-gradient(272deg, rgba(255, 33, 33, 0) -16.91%, #ff3407 -.51%, #fc964c 12.46%, #fc964c 22.5%, #f62f03 46.54%, rgba(246, 32, 3, 0) 71.84%, #fd7c34 112.33%);",
                    }}
                ></div>

                {/* Layer 1: Forward */}
                <div ref={layer1Ref} className={`${textBase} z-10 transform -translate-y-10`}>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-2">
                        If you really want to move
                    </h3>
                    <h3 className="text-4xl md:text-5xl lg:text-7xl font-semibold text-white">
                        Three Steps Forward
                    </h3>
                </div>

                {/* Layer 2: Deep Choice */}
                <div ref={layer2Ref} className={`${textBase} z-20`}>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-2">
                        You must first go
                    </h3>
                    <h3 className="text-4xl md:text-5xl lg:text-7xl font-semibold text-white">
                        Three Steps Deep
                    </h3>
                </div>

                {/* Layer 3: Body */}
                <div ref={layer3Ref} className={`${textBase} z-30`}>
                    <p className="text-xl md:text-3xl text-white/60 mb-2 font-light">Deep into the</p>
                    <h2 className="text-6xl md:text-9xl font-bold tracking-tighter mb-2">
                        BODY
                    </h2>
                    <p className="text-xl md:text-3xl max-w-2xl mx-auto leading-relaxed">
                        where <span className="text-gray-300">nourishment</span> creates rhythm.
                    </p>
                </div>

                {/* Layer 4: Mind */}
                <div ref={layer4Ref} className={`${textBase} z-40`}>
                    <p className="text-xl md:text-3xl text-white/60 mb-2 font-light">Deep into the</p>
                    <h2 className="text-6xl md:text-9xl font-bold tracking-tighter mb-2">
                        MIND
                    </h2>
                    <p className="text-xl md:text-3xl max-w-3xl mx-auto leading-relaxed">
                        not motivation, but <span className="text-gray-300">mastery over attention</span>.
                    </p>
                </div>

                {/* Layer 5: Self */}
                <div ref={layer5Ref} className={`${textBase} z-50`}>
                    <p className="text-xl md:text-3xl text-white/60 mb-3 font-light">Deep into the real</p>
                    <h2 className="text-6xl md:text-9xl font-bold tracking-tighter mb-2">
                        SELF
                    </h2>
                    <p className="text-xl md:text-3xl max-w-3xl mx-auto leading-relaxed">
                        away from apparent identity of self.
                    </p>
                </div>

                {/* Layer 6: Conclusion */}
                <div ref={layer6Ref} className={`${textBase} z-60 max-w-7xl mx-auto`}>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-2">
                        Reality Still Exists.
                    </h3>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white">
                        We Checked, Tried and Tested.
                    </h3>

                    <div className="flex flex-wrap gap-8 md:gap-16 justify-center items-center mt-12">
                        <div className="stamp-effect px-8 py-3 border-4 border-[#c8490fe1] text-white text-2xl md:text-4xl font-black uppercase tracking-tighter rotate-[-5deg] bg-white/5 backdrop-blur-sm shadow-[0_0_20px_rgba(255,123,0,0.2)]">
                            Authentic
                        </div>
                        <div className="stamp-effect px-8 py-3 border-4 border-[#c8490fe1] text-white text-2xl md:text-4xl font-black uppercase tracking-tighter rotate-[3deg] bg-white/5 backdrop-blur-sm shadow-[0_0_20px_rgba(255,123,0,0.2)]">
                            Authorized
                        </div>
                        <div className="stamp-effect px-8 py-3 border-4 border-[#c8490fe1] text-white text-2xl md:text-4xl font-black uppercase tracking-tighter rotate-[-2deg] bg-white/5 backdrop-blur-sm shadow-[0_0_20px_rgba(255,123,0,0.2)]">
                            Adhyatmik
                        </div>
                    </div>

                    <style jsx>{`
                        .stamp-effect {
                            mask-image: linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,1) 100%);
                            mix-blend-mode: screen;
                            position: relative;
                            box-shadow: inset 0 0 10px rgba(255,123,0,0.3);
                        }
                        .stamp-effect::after {
                            content: '';
                            position: absolute;
                            inset: 0;
                            background-image: 
                                radial-gradient(circle, #ff7b00 1px, transparent 1px),
                                radial-gradient(circle, #ff7b00 1px, transparent 1px);
                            background-size: 4px 4px;
                            background-position: 0 0, 2px 2px;
                            opacity: 0.1;
                            pointer-events: none;
                        }
                    `}</style>
                </div>

            </section>
        </div>
    );
};

export default DeepLayerSection;
