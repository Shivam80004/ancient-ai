'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import SplitText from '../ui/SplitText';
import RevealText from '../animation/RevealText';

const logosRow1 = [
    { name: "Accenture", src: "/logos/Accenture.svg.png" },
    { name: "BITS Pilani", src: "/logos/BITS_Pilani-Logo.svg.png" },
    { name: "Google", src: "/logos/Google__G__logo.svg.png" },
    { name: "IIT Bombay", src: "/logos/IIT_Bombay_logo.png" },
    { name: "IIT Gandhinagar", src: "/logos/IIT_Gandhinagar_Logo.svg.png" },
    { name: "IIT Bhubaneswar", src: "/logos/Indian_Institute_of_Technology_Bhubaneswar_Logo.svg" },
];

const logosRow2 = [
    { name: "Infosys", src: "/logos/Infosys_logo.svg.png" },
    { name: "ICT Mumbai", src: "/logos/Institute_of_Chemical_Technology_logo.png" },
    { name: "Wipro", src: "/logos/Wipro_new_logo.svgWipro_new_logo.svg.png" },
    { name: "Akshaya Patra", src: "/logos/akshaya-patra-logo.png" },
    // { name: "Manastu Space", src: "/logos/logo-manastu-space-technologies-rpzyft.jpg" },
    { name: "Mumbai University", src: "/logos/university-of-mumbai-alkesh-dinesh-mody-institute-for-financial-management-studies-college-school.jpg" },
];

const LogoCard = ({ name, src }) => (
    <div className="flex-shrink-0 md:w-[340px] w-[240px] md:h-[220px] h-[160px] mx-1 border border-white/1 rounded-2xl flex flex-col items-center justify-center group bg-[#111] transition-colors duration-300 shadow-lg p-6">
        <div className="relative w-full h-[60%] mb-4 group-hover:opacity-100 transition-opacity ">
            <Image
                src={src}
                alt={name}
                fill
                className="object-contain mix-blend-lighten"
                sizes="(max-width: 768px) 160px, 240px"
            />
        </div>
        <div className="text-center">
            <h3 className="text-white text-lg md:text-xl font-medium tracking-wide leading-tight">{name}</h3>
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

            <SplitText
                text="People Supporting Better"
                className="text-3xl text-center md:text-5xl lg:text-6xl font-light text-white mt-8 md:mt-20 pb-4 px-2"
                highlightText="Experiences"
                highlightClassName="font-semibold text-white ml-2"
                duration={1}
            />
            {/* <SplitText
                text="Appreciated by professionals across diverse leading institutions"
                className="text-center text-white/80 text-lg md:text-xl font-light tracking-wide leading-tight mb-6 md:mb-12"
                highlightText=""
                highlightClassName=""
                duration={0.1}
                y={2}
                delay={0.2}
            /> */}
            <RevealText y='30' delay={0.2} className='text-center text-white/80 text-lg md:text-xl font-light tracking-wide leading-tight mb-6 md:mb-12'>Appreciated by professionals across diverse leading institutions</RevealText>
            {/* Gradient fade on edges */}
            <div className="relative w-full max-w-[1920px] mx-auto">
                {/* Row 1 - Left */}
                <MarqueeRow logos={logosRow1} direction="left" speed={30} />

                {/* Row 2 - Right */}
                <MarqueeRow logos={logosRow2} direction="right" speed={35} />

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
