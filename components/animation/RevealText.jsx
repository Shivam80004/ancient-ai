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

            // Initial state
            gsap.set(elements, {
                y: "100%",
                opacity: 0,
                rotate: type === "chars" ? 5 : 0
            });

            // Animation
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

    // Splitting logic
    const text = typeof children === 'string' ? children : '';
    let content;

    if (type === "chars") {
        content = text.split("").map((char, i) => (
            <span key={i} className="inline-block overflow-hidden align-top">
                <span className="reveal-inner inline-block" style={{ whiteSpace: "pre" }}>
                    {char}
                </span>
            </span>
        ));
    } else {
        content = text.split(" ").map((word, i) => (
            <span key={i} className="inline-block overflow-hidden align-top mr-[0.25em]">
                <span className="reveal-inner inline-block">
                    {word}
                </span>
            </span>
        ));
    }

    return (
        <div ref={elRef} className={className} style={{ lineHeight: 1.2 }}>
            {content}
        </div>
    );
};

export default RevealText;
