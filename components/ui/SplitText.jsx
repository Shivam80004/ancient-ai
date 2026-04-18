'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SplitText = ({
    text,
    highlightText,
    className = "",
    highlightClassName = "",
    containerClassName = "",
    delay = 0,
    duration = 0.8,
    y = 30,
}) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Split text animation
            const chars = containerRef.current.querySelectorAll('.char');

            gsap.fromTo(chars,
                {
                    y: y,
                    opacity: 0,
                    // rotationX: -30
                },
                {
                    y: 0,
                    opacity: 1,
                    // rotationX: 30,
                    stagger: 0.02,
                    duration: duration,
                    ease: "back.out(1.7)",
                    delay: delay,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: `top ${100 - y}%`,
                        toggleActions: "play none none none"
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [delay, duration]);

    // Function to wrap characters in spans, keeping words intact for correct wrapping
    const splitToSpans = (str) => {
        return str.split(/(\s+)/).map((word, wordIndex) => {
            if (word.match(/\s+/)) {
                // Return spaces as plain whitespace to allow natural breaking
                return <span key={wordIndex} className="whitespace-pre">{word}</span>;
            }
            return (
                <span key={wordIndex} className="inline-block relative">
                    {word.split('').map((char, charIndex) => (
                        <span key={charIndex} className="char inline-block">
                            {char}
                        </span>
                    ))}
                </span>
            );
        });
    };

    return (
        <div ref={containerRef} className={`perspective-1000 ${containerClassName}`}>
            <h3 className={className}>
                {splitToSpans(text)}
                {highlightText && (
                    <span className={highlightClassName}>
                        {splitToSpans(highlightText)}
                    </span>
                )}
            </h3>
        </div>
    );
};

export default SplitText;
