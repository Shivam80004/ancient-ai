'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const logosRow1 = [
    { name: "Global University", sub: "Cambridge" },
    { name: "City Institute", sub: "London" },
    { name: "King's College", sub: "London" },
    { name: "Warwick", sub: "University" },
    { name: "Global University", sub: "Cambridge" },
    { name: "City Institute", sub: "London" },
    { name: "King's College", sub: "London" },
    { name: "Warwick", sub: "University" },
];

const logosRow2 = [
    { name: "Nottingham", sub: "University" },
    { name: "UCL", sub: "London" },
    { name: "Oxford", sub: "University" },
    { name: "Nottingham", sub: "University" },
    { name: "UCL", sub: "London" },
    { name: "Oxford", sub: "University" },
];

const logosRow3 = [
    { name: "Leicester", sub: "University" },
    { name: "Queen Mary", sub: "London" },
    { name: "Loughborough", sub: "University" },
    { name: "Leicester", sub: "University" },
    { name: "Queen Mary", sub: "London" },
    { name: "Loughborough", sub: "University" },
];

const LogoCard = ({ name, sub }) => (
    <div className="flex-shrink-0 md:w-[340px] w-[240px] md:h-[220px] h-[120px] mx-1 bg-[#0a0a0a] border border-white/5 rounded-2xl flex flex-col items-center justify-center group hover:bg-[#111] transition-colors duration-300 shadow-lg">
        <div className="text-white fill-current mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
            {/* Generic University Icon/Logo Placeholder */}
            <svg width="82" height="82" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
            </svg>
        </div>
        <div className="text-center">
            <h3 className="text-white text-2xl font-serif tracking-wide leading-tight">{name}</h3>
            {sub && <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mt-1">{sub}</p>}
        </div>
    </div>
);

const MarqueeRow = ({ logos, direction = 'left', speed = 40 }) => {
    const rowRef = useRef(null);

    useEffect(() => {
        const element = rowRef.current;
        // Move -33.33% because we have 3 sets of logos. 
        // 1 set = 33.33% of total width.
        const xPercentStart = direction === 'left' ? 0 : -33.33;
        const xPercentEnd = direction === 'left' ? -33.33 : 0;

        const ctx = gsap.context(() => {
            gsap.fromTo(element,
                { xPercent: xPercentStart },
                {
                    xPercent: xPercentEnd,
                    duration: speed,
                    ease: "none",
                    repeat: -1
                }
            );
        }, rowRef);

        return () => ctx.revert();
    }, [direction, speed]);

    return (
        <div className="relative flex overflow-hidden py-3 fading-edge-mask">
            <div
                ref={rowRef}
                className="flex w-max"
            >
                {/* 
                   Render 3 sets of logos to ensure seamless looping.
                   At least 2 sets are needed to fill the screen + buffer, 
                   but 3 makes the math (33.33%) easy and reliable for wide screens.
                */}
                {[...logos, ...logos, ...logos].map((logo, i) => (
                    <LogoCard key={i} {...logo} />
                ))}
            </div>
        </div>
    );
};

const MarqueeLogo = () => {
    return (
        <section className="w-full py-20 bg-black flex flex-col justify-center overflow-hidden">

            {/* Gradient fade on edges */}
            <div className="relative w-full max-w-[1920px] mx-auto">
                {/* Row 1 - Left */}
                <MarqueeRow logos={logosRow1} direction="left" speed={45} />

                {/* Row 2 - Right */}
                <MarqueeRow logos={logosRow2} direction="right" speed={50} />

                {/* Row 3 - Left */}
                {/* <MarqueeRow logos={logosRow3} direction="left" speed={55} /> */}
            </div>

            <style jsx>{`
                .fading-edge-mask {
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }
            `}</style>
        </section>
    );
};

export default MarqueeLogo;
