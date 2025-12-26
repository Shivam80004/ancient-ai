'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const HeroBanner = () => {
    const wrapperRef = useRef(null);
    const wordsRef = useRef([]);
    const magneticBtnRef = useRef(null);
    const magneticInnerRef = useRef(null);
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

        // Magnetic Effect Logic
        const initMagnetic = () => {
            if (window.innerWidth <= 991) return;

            const m = magneticBtnRef.current;
            const inner = magneticInnerRef.current;
            if (!m) return;

            const resetEl = (el, immediate) => {
                if (!el) return;
                gsap.killTweensOf(el);
                (immediate ? gsap.set : gsap.to)(el, {
                    x: "0em",
                    y: "0em",
                    rotate: "0deg",
                    clearProps: "all",
                    ...(!immediate && { ease: "elastic.out(1, 0.3)", duration: 1.6 })
                });
            };

            const handleMouseEnter = () => {
                resetEl(m, true);
                resetEl(inner, true);
            };

            const handleMouseMove = (e) => {
                const b = m.getBoundingClientRect();
                const strength = 50;
                const innerStrength = 25;
                const offsetX = ((e.clientX - b.left) / m.offsetWidth - 0.5) * (strength / 16);
                const offsetY = ((e.clientY - b.top) / m.offsetHeight - 0.5) * (strength / 16);

                gsap.to(m, { x: offsetX + "em", y: offsetY + "em", rotate: "0.001deg", ease: "power4.out", duration: 1.6 });

                if (inner) {
                    const innerOffsetX = ((e.clientX - b.left) / m.offsetWidth - 0.5) * (innerStrength / 16);
                    const innerOffsetY = ((e.clientY - b.top) / m.offsetHeight - 0.5) * (innerStrength / 16);
                    gsap.to(inner, { x: innerOffsetX + "em", y: innerOffsetY + "em", rotate: "0.001deg", ease: "power4.out", duration: 2 });
                }
            };

            const handleMouseLeave = () => {
                gsap.to(m, { x: "0em", y: "0em", ease: "elastic.out(1, 0.3)", duration: 1.6, clearProps: "all" });
                if (inner) {
                    gsap.to(inner, { x: "0em", y: "0em", ease: "elastic.out(1, 0.3)", duration: 2, clearProps: "all" });
                }
            };

            m.addEventListener('mouseenter', handleMouseEnter);
            m.addEventListener('mousemove', handleMouseMove);
            m.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                m.removeEventListener('mouseenter', handleMouseEnter);
                m.removeEventListener('mousemove', handleMouseMove);
                m.removeEventListener('mouseleave', handleMouseLeave);
            };
        };

        const cleanupMagnetic = initMagnetic();

        return () => {
            timer.kill();
            gsap.killTweensOf([wrapper, ...wordEls]);
            if (cleanupMagnetic) cleanupMagnetic();
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
                <h1 className="hero-title text-4xl md:text-7xl font-popinse font-normal text-white">
                    <span className="reveal-word inline-block">We</span>&nbsp;
                    <span className="reveal-word inline-block">Take</span>&nbsp;
                    <span className="reveal-word inline-block">you</span>&nbsp;
                    <span className="reveal-word inline-block">Beyond</span>&nbsp;
                    <span className="reveal-word inline-block font-bold text-6xl md:text-8xl">Artificial</span>&nbsp;<br />
                    <span className="reveal-word inline-block">to</span>&nbsp;
                    <span className="reveal-word inline-block">Reveal</span>
                    <span ref={wrapperRef} className="reveal-word text-6xl md:text-8xl rotating-text__wrapper inline-block relative align-bottom overflow-hidden">
                        {words.map((word, i) => (
                            <span
                                key={word}
                                ref={el => wordsRef.current[i] = el}
                                className="rotating-text__word absolute left-0 top-3 px-5 whitespace-nowrap font-semibold text-[#ff7b00]!"
                            >
                                {word}
                            </span>
                        ))}
                    </span>
                    <span className="reveal-word ml-2 inline-block">Intelligence</span>
                </h1>
                {/* <div className='hero-logo opacity-0 w-180 h-48 mt-7'>
                    <img src="/logo.svg" className='brightness-1 invert h-full w-full object-cover pl-3' alt="" />
                </div> */}
            </div>

            {/* Bottom Button */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
                <div className="btn-magnetic">
                    <a
                        href="#explore"
                        ref={magneticBtnRef}
                        className="btn-magnetic__click"
                        data-magnetic-strength="50"
                        data-magnetic-strength-inner="25"
                    >
                        <div className="btn-magnetic__fill"></div>
                        <div ref={magneticInnerRef} data-magnetic-inner-target="" className="btn-magnetic__content">
                            <div className="btn-magnetic__text">
                                <p className="btn-magnetic__text-p">Explore more</p>
                                <p className="btn-magnetic__text-p is--duplicate">Explore more</p>
                            </div>
                        </div>
                    </a>
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
