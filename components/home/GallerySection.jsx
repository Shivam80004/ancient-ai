'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const images = [
    { src: '/gellery-img/gallery-img-1.jpg', title: 'Avenue' },
    { src: '/gellery-img/gallery-img-2.webp', title: 'Workshop' },
    { src: '/gellery-img/gallery-img-3.jpg', title: 'Music' },
    { src: '/gellery-img/gallery-img-5.png', title: 'Questions' },
    { src: '/gellery-img/gallery-img-4.jpeg', title: 'Future' },
    { src: '/gellery-img/gallery-img-6.png', title: 'Hunger' },
    { src: '/gellery-img/gallery-img-7.png', title: 'Real Friendship' },
    { src: '/gellery-img/gallery-img-8.png', title: 'Velocity' },
    { src: '/gellery-img/gallery-img-9.jpg', title: 'Studio' },
];

const marqueeTexts = [
    "Tribe", "Seek", "Vibe", "Guide", "Reset", "Ask", "Tribe", "Seek", "Vibe", "Guide", "Reset", "Ask"
];

const GallerySection = () => {
    const sectionRef = useRef(null);
    const textRowRef = useRef(null);
    const imageRowRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const setupMarquee = (target, speed, direction) => {
                const fromValue = direction === 1 ? 0 : -50;
                const toValue = direction === -1 ? 0 : -50;

                gsap.set(target, { xPercent: fromValue });

                const tl = gsap.to(target, {
                    xPercent: toValue,
                    repeat: -1,
                    duration: speed,
                    ease: "none",
                    paused: false
                });

                tl.totalProgress(0.5);
                return tl;
            };

            const tl1 = setupMarquee(textRowRef.current, 20, 1);
            const tl2 = setupMarquee(imageRowRef.current, 35, -1);

            // Subtle parallax for the section
            gsap.fromTo(sectionRef.current,
                { backgroundColor: 'rgba(5, 5, 5, 1)' },
                {
                    backgroundColor: 'rgba(10, 10, 12, 1)',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top center",
                        end: "bottom center",
                        scrub: true
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const renderTextMarquee = () => (
        <div className="py-4 md:py-8 scale-105 overflow-hidden border-y- border-black/10"
            style={{
                background: 'radial-gradient(50% 60% at 50% 100%, #fb1e01 0%, transparent 100%)'
            }}
        >
            <div ref={textRowRef} className="flex whitespace-nowrap gap-8 md:gap-16">
                {[...marqueeTexts, ...marqueeTexts].map((text, idx) => (
                    <span
                        key={idx}
                        className="text-4xl md:text-6xl text-white flex items-center tracking-tighter font-poppins"
                    >
                        {text} &nbsp;&nbsp;
                        <svg className="w-3 h-3 mx-7 fill-current text-white" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="8" />
                        </svg>
                        {/* <span className="mx-4 text-white"></span> */}
                    </span>
                ))}
            </div>
        </div>
    );

    const renderImageMarquee = () => (
        <div className="flex relative whitespace-nowrap overflow-hidden pt-8">
            <div ref={imageRowRef} className="flex gap-4 md:gap-8 px-2 md:px-4">
                {[...images, ...images].map((img, idx) => (
                    <div
                        key={idx}
                        className="gallery-card group relative h-[250px] w-[350px] md:h-[400px] md:w-[550px] shrink-0 rounded-2xl overflow-hidden cursor-pointer"
                        style={{
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                    >
                        <img
                            src={img.src}
                            alt={img.title}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                            <h3 className="text-white text-2xl font-semibold">{img.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <section
            ref={sectionRef}
            className="w-full mt-14 overflow-hidden relative bg-[#050505] flex flex-col pb-16 z-10 rounded-t-[40px] md:rounded-t-[100px] border-t border-white/10"
            style={{
                boxShadow: '0 -20px 50px rgba(0,0,0,0.5)'
            }}
        >
            {/* <div className="container mx-auto px-4 mb-7">
                <h3 className="text-3xl -rotate-2 text-center md:text-5xl lg:text-6xl font-light text-white mt-6 md:mt-32">People Having Better<span className="text-3xl text-center md:text-5xl lg:text-6xl font-semibold text-white">&nbsp;Experiences</span></h3>
            </div> */}
            {renderImageMarquee()}
            {renderTextMarquee()}
        </section>
    );
};

export default GallerySection;
