'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const RevealText = ({ children, className = "", type = "words", delay = 0, stagger = 0.02 }) => {
    const elRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const elements = elRef.current.querySelectorAll('.reveal-inner');

            gsap.set(elements, {
                y: "110%",
                opacity: 0,
                rotate: type === "chars" ? 5 : 0
            });

            gsap.to(elements, {
                y: "0%",
                opacity: 1,
                rotate: 0,
                duration: 1.2,
                stagger: stagger,
                delay: delay,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: elRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        }, elRef);

        return () => ctx.revert();
    }, [type, stagger, delay]);

    const text = typeof children === 'string' ? children : '';

    if (type === "chars") {
        const chars = text.split("").map((char, i) => (
            <span
                key={i}
                style={{
                    display: 'inline-block',
                    overflow: 'hidden',
                    verticalAlign: 'bottom',
                    // Each character must never break — it wraps as a unit
                    whiteSpace: 'pre',
                }}
            >
                <span className="reveal-inner" style={{ display: 'inline-block' }}>
                    {char}
                </span>
            </span>
        ));

        return (
            <div ref={elRef} className={className}>
                {chars}
            </div>
        );
    }

    // ── Word mode ────────────────────────────────────────────────────────────
    // Each word is an inline-block with overflow-hidden for the slide-up mask.
    // `whiteSpace: nowrap` on the outer span guarantees the ENTIRE word moves
    // to the next line as one unit — it can never split mid-word.
    const words = text.split(" ").map((word, i) => (
        <span
            key={i}
            style={{
                display: 'inline-block',
                overflow: 'hidden',
                verticalAlign: 'bottom',
                // This is the key fix: the word will NEVER be broken across lines.
                // The browser wraps the whole span to the next line as a unit.
                whiteSpace: 'nowrap',
                marginRight: '0.3em',
            }}
        >
            <span className="reveal-inner" style={{ display: 'inline-block' }}>
                {word}
            </span>
        </span>
    ));

    return (
        <div ref={elRef} className={className}>
            {words}
        </div>
    );
};

export default RevealText;
