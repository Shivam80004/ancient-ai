'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const images = [
    { src: '/gellery-img/gallery-img-1.jpg', year: '2015' },
    { src: '/gellery-img/gallery-img-2.webp', year: '2018' },
    { src: '/gellery-img/gallery-img-3.jpg', year: '2019' },
    { src: '/gellery-img/gallery-img-4.jpg', year: '2020' },
    { src: '/gellery-img/gallery-img-5.png', year: '2021' },
    { src: '/gellery-img/gallery-img-6.png', year: '2022' },
    { src: '/gellery-img/gallery-img-7.png', year: '2023' },
    { src: '/gellery-img/gallery-img-8.png', year: '2024' },
    { src: '/gellery-img/gallery-img-9.jpg', year: '2025' },
];

const GallerySection = () => {
    const sectionRef = useRef(null);
    const col1Ref = useRef(null);
    const col2Ref = useRef(null);
    const col3Ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Only apply parallax on larger screens
            const mm = gsap.matchMedia();

            mm.add("(min-width: 768px)", () => {
                const scrollConfig = {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                };

                // Middle column moves opposite/differently to create depth
                gsap.fromTo(col2Ref.current,
                    { y: -50 },
                    {
                        y: 50,
                        ease: "none",
                        scrollTrigger: scrollConfig
                    }
                );

                // Outer columns move slowly
                gsap.fromTo([col1Ref.current, col3Ref.current],
                    { y: 50 },
                    {
                        y: -50,
                        ease: "none",
                        scrollTrigger: scrollConfig
                    }
                );
            });

            // Fade in animation for individual cards with staggered reveal
            const cards = gsap.utils.toArray('.gallery-card');
            gsap.fromTo(cards,
                { opacity: 0, scale: 0.9, y: 30 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: {
                        amount: 0.5,
                        grid: [3, 3],
                        from: "center"
                    },
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 60%",
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Split images into 3 columns for the masonry/parallax effect
    const col1 = images.filter((_, i) => i % 3 === 0);
    const col2 = images.filter((_, i) => i % 3 === 1);
    const col3 = images.filter((_, i) => i % 3 === 2);

    const renderCard = (img, idx) => (
        <div
            key={idx}
            className="gallery-card group relative h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden cursor-pointer backdrop-blur-sm"
            style={{
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255, 255, 255, 0.01)'
            }}
        >
            <img
                src={img.src}
                alt={`Gallery image ${img.year}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

            {/* <div className="absolute top-4 left-4 transform translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="inline-block px-3 py-1 rounded-full text-white text-xs font-medium backdrop-blur-md bg-white/10 border border-white/20">
                    {img.year}
                </span>
            </div> */}

            <div className="absolute bottom-6 left-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                <h3 className="text-white text-xl font-light tracking-wide">Memory</h3>
            </div>
        </div>
    );

    return (
        <section
            ref={sectionRef}
            className="w-full py-20 px-4 md:px-8 lg:px-12 overflow-hidden relative min-h-screen content-center"
        >
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Column 1 */}
                    <div ref={col1Ref} className="flex flex-col gap-6">
                        {col1.map((img, i) => renderCard(img, i))}
                    </div>

                    {/* Column 2 - Offset for visual interest */}
                    <div ref={col2Ref} className="flex flex-col gap-6 md:mt-24">
                        {col2.map((img, i) => renderCard(img, i))}
                    </div>

                    {/* Column 3 */}
                    <div ref={col3Ref} className="flex flex-col gap-6 md:mt-12">
                        {col3.map((img, i) => renderCard(img, i))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GallerySection;
