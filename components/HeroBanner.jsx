'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const HeroBanner = () => {
    const wrapperRef = useRef(null);
    const wordsRef = useRef([]);
    const words = ["Authorised", "Authentic", "Adhyatmik"];

    useEffect(() => {
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

        const showNext = () => {
            const nextIndex = (activeIndex + 1) % wordEls.length;
            const prev = wordEls[activeIndex];
            const current = wordEls[nextIndex];

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
            gsap.delayedCall(stepDuration, showNext);
        };

        const timer = gsap.delayedCall(stepDuration, showNext);

        // Entrance animations for heading and logo
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo('.reveal-word',
            { y: 5, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.04, duration: 2 }
        )
            .fromTo('.hero-logo',
                { scale: 0.9, opacity: 0, filter: 'blur(10px)' },
                { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.5 },
                '-=1.6'
            );

        return () => {
            timer.kill();
            gsap.killTweensOf([wrapper, ...wordEls]);
        };
    }, []);

    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center py-[6rem]">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
            >
                <video src="/videos/try-1.mp4" className='h-full w-full object-cover' autoPlay loop muted />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center">
                <h1 className="hero-title text-4xl md:text-4xl font-popinse font-normal text-white">
                    <span className="reveal-word inline-block">Take</span>&nbsp;
                    <span className="reveal-word inline-block">you</span>&nbsp;
                    <span className="reveal-word inline-block">Beyond</span>&nbsp;
                    <span className="reveal-word inline-block font-semibold">Artificial</span>&nbsp;
                    <span className="reveal-word inline-block">to</span>&nbsp;
                    <span className="reveal-word inline-block">reveal</span> <br />
                    <span ref={wrapperRef} className="reveal-word rotating-text__wrapper inline-block relative align-bottom overflow-hidden">
                        {words.map((word, i) => (
                            <span
                                key={word}
                                ref={el => wordsRef.current[i] = el}
                                className="rotating-text__word absolute left-0 top-1 whitespace-nowrap font-semibold text-[#ff7b00]!"
                            >
                                {word}
                            </span>
                        ))}
                    </span>
                    <span className="reveal-word ml-2 inline-block">Intelligent</span>
                </h1>
                <div className='hero-logo opacity-0 w-180 h-48 mt-7'>
                    <img src="/logo.svg" className='brightness-1 invert h-full w-full object-cover pl-3' alt="" />
                </div>
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
