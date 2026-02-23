'use client';
import React, { useRef } from 'react';
import RevealText from '../animation/RevealText';

const PageHero = ({ title, subtitle, image }) => {
    const heroRef = useRef(null);

    return (
        <section ref={heroRef} className="relative h-[80dvh] flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image/Overlay */}
            <div className="absolute inset-0 z-0">
                {image && <img src={image} alt="Hero Background" className="w-full h-full object-cover opacity-80" />}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
                <div className="overflow-hidden mb-3">
                    <RevealText
                        type="chars"
                        className="text-5xl md:text-[7rem] font-medium text-white tracking-tight text-center px-4"
                        stagger={0.03}
                    >
                        {title}
                    </RevealText>
                </div>
                {subtitle && (
                    <div className="max-w-2xl mx-auto">
                        <RevealText
                            type="words"
                            className="text-xl md:text-2xl text-white/80 font-light leading-relaxed"
                            stagger={0.01}
                            delay={0.5}
                        >
                            {subtitle}
                        </RevealText>
                    </div>
                )}
            </div>

            {/* Custom Gradient Line */}
            {/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-orange-500 to-transparent opacity-50" /> */}
        </section>
    );
};

export default PageHero;
