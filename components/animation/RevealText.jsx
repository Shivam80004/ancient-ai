'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const RevealText = ({
    children,
    className = "",
    type = "words",
    delay = 0,
    stagger = 0.02,
    duration = 1,
    y = "100%",
    animationOnScrool = true, // Legacy prop support (typo preserved)
    style = {}
}) => {
    const elRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const elements = elRef.current.querySelectorAll('.reveal-inner');

            // Initial state
            gsap.set(elements, {
                y: y,
                opacity: 0,
                rotate: type === "chars" ? 3 : 0
            });

            // Animation configuration
            const animConfig = {
                y: "0%",
                opacity: 1,
                rotate: 0,
                duration: duration,
                stagger: stagger,
                delay: delay,
                ease: "power4.out",
            };

            if (animationOnScrool) {
                animConfig.scrollTrigger = {
                    trigger: elRef.current,
                    start: "top 103%",
                    toggleActions: "play none none none"
                };
            }

            gsap.to(elements, animConfig);
        }, elRef);

        return () => ctx.revert();
    }, [type, stagger, delay, duration, y, animationOnScrool]);

    // Handle non-string children gracefully (fallback)
    if (typeof children !== 'string') {
        return (
            <div ref={elRef} className={className} style={{ ...style, lineHeight: 1.2 }}>
                <span className="reveal-inner inline-block opacity-0">
                    {children}
                </span>
            </div>
        );
    }

    const text = children;

    if (type === "chars") {
        // Each word is wrapped in whitespace-nowrap so the entire word
        // moves to a new line as a unit — characters never split across lines.
        const content = text.split(" ").map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block whitespace-nowrap align-top mr-[0.25em]">
                {word.split("").map((char, charIndex) => (
                    <span key={charIndex} className="inline-block overflow-hidden align-top">
                        <span className="reveal-inner inline-block">
                            {char}
                        </span>
                    </span>
                ))}
            </span>
        ));

        return (
            <div ref={elRef} className={className} style={{ lineHeight: 1.2, ...style }}>
                {content}
            </div>
        );
    }

    // ── Word mode ────────────────────────────────────────────────────────────
    // `overflow-hidden` on the outer span clips the slide-up animation.
    // `whitespace-nowrap` ensures the whole word wraps as one unit —
    // the line break happens between words, never inside them.
    const content = text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-top mr-[0.25em]">
            <span className="reveal-inner inline-block whitespace-nowrap">
                {word}
            </span>
        </span>
    ));

    return (
        <div ref={elRef} className={className} style={{ lineHeight: 1.2, ...style }}>
            {content}
        </div>
    );
};

export default RevealText;
