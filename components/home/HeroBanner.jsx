'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import MagneticButton from '../../components/ui/MagneticButton';

const HeroBanner = () => {
    const wrapperRef = useRef(null);
    const wordsRef = useRef([]);
    const words = ["AUTHORISED", "AUTHENTIC", "ADHYATMIK"];

    React.useLayoutEffect(() => {
        const wordEls = wordsRef.current;
        const wrapper = wrapperRef.current;
        if (!wordEls.length || !wrapper) return;

        const stepDuration = 2.10;
        const inDuration = 0.5;
        const outDuration = 0.5;

        // Initial state
        gsap.set(wordEls, { yPercent: 120, autoAlpha: 0 });

        // Show first word
        let activeIndex = 0;
        gsap.set(wordEls[activeIndex], { yPercent: 0, autoAlpha: 1 });

        // Set initial width
        const firstWidth = wordEls[activeIndex].getBoundingClientRect().width;
        gsap.set(wrapper, { width: firstWidth });

        let timer; // Mutable timer reference for cleanup

        const showNext = () => {
            // Safety check: ensure component is still mounted and refs exist
            if (!wordEls || !wordEls.length) return;

            const nextIndex = (activeIndex + 1) % wordEls.length;
            const prev = wordEls[activeIndex];
            const current = wordEls[nextIndex];

            // Validate elements exist (prevent null access if unmounting)
            if (!prev || !current) return;

            // Safe access to getBoundingClientRect
            const targetWidth = current.getBoundingClientRect().width;

            // Animate wrapper width
            gsap.to(wrapper, {
                width: targetWidth,
                duration: inDuration,
                ease: 'power4.inOut'
            });

            // Move old word out
            gsap.to(prev, {
                yPercent: -120,
                autoAlpha: 0,
                duration: outDuration,
                ease: 'power4.inOut'
            });

            // Reveal new word
            gsap.fromTo(current,
                { yPercent: 120, autoAlpha: 0 },
                {
                    yPercent: 0,
                    autoAlpha: 1,
                    duration: inDuration,
                    ease: 'power4.inOut'
                }
            );

            activeIndex = nextIndex;
            timer = gsap.delayedCall(stepDuration, showNext);
        };

        timer = gsap.delayedCall(stepDuration, showNext);


        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo('.reveal-word',
            { y: 5, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.04, duration: 2 }
        )
            .fromTo('.hero-logo',
                { scale: 0.9, opacity: 0, filter: 'blur(10px)' },
                { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.5 },
                '-=1.6'
            )
            .fromTo('.btn-magnetic',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.5 },
                '-=1.2'
            );

        return () => {
            if (timer) timer.kill();
            gsap.killTweensOf([wrapper, ...wordEls]);
        };
    }, []);

    return (
        <section className="hero-logo relative md:h-dvh h-svh w-full overflow-hidden flex items-center justify-center py-[6rem]">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
            >
                <video src="https://res.cloudinary.com/dh3fdtkbe/video/upload/v1776500774/try-1_g3lwa9.mp4" className='h-full w-full object-cover' autoPlay loop muted />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center">
                <h2 className="hero-title text-4xl md:text-4xl font-popinse font-normal text-white">
                    We Take You Beyond{" "}
                    <span className="bg-[linear-gradient(261.26deg,#f6200300_-11.86%,#fc964c_5.45%,#f62003_30.99%,#f62003_101.39%,#fd7c34_103.82%)] bg-clip-text text-transparent font-bold">
                        Artificials
                    </span>{" "}
                    To Reveal
                </h2>
                <span ref={wrapperRef} className="reveal-word text-4xl md:text-[12rem] rotating-text__wrapper font-extrabold overflow-hidden inline-block relative align-bottom">
                    {words.map((word, i) => (
                        <span
                            key={word}
                            ref={el => wordsRef.current[i] = el}
                            className="rotating-text__word absolute left-0 md:top-3 top-1 px-5 whitespace-nowrap font-bold"
                        >
                            {word}
                        </span>
                    ))}
                </span>
                <h2 className="hero-title text-4xl md:text-6xl font-popinse font-normal text-white">
                    Intelligence
                </h2>
            </div>

            {/* Bottom Button */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
                <MagneticButton link="/contact-us" text="Enroll Now" />
            </div>

            <style jsx>{`
                .rotating-text__wrapper {
                    height: 1.2em;
                    vertical-align: -0.2em;
                    transition: width 0.5s ease;
                }
                .rotating-text__word {
                    color: #fff;
                }
            `}</style>
        </section>
    );
};

export default HeroBanner;
