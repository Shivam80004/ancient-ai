'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
    { number: 30, label: "Initiatives." },
    { number: 7, label: "Branches." },
    { number: 1, label: "Mission." }
];

const ImpactStats = () => {
    const containerRef = useRef(null);
    const itemsRef = useRef([]);
    const numberRefs = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Container/Item Rise Animation
            gsap.fromTo(itemsRef.current,
                {
                    y: 100,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Number Counting Animation
            itemsRef.current.forEach((item, index) => {
                const numRef = numberRefs.current[index];
                const targetNum = STATS[index].number;

                gsap.fromTo(numRef,
                    { innerText: 0 },
                    {
                        innerText: targetNum,
                        duration: 1,
                        ease: "power2.out",
                        snap: { innerText: 1 }, // Snap to whole numbers
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top 80%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="w-full py-40 text-white flex items-center justify-center"
        // style={{
        //     background: "linear-gradient(0deg, transparent, rgba(255, 123, 0, 0.2), transparent)"
        // }}
        >
            <div className="max-w-7xl w-full mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center">
                    {STATS.map((stat, index) => (
                        <div
                            key={index}
                            ref={el => itemsRef.current[index] = el}
                            className="flex flex-col items-center justify-center space-y-2"
                        >
                            <span
                                ref={el => numberRefs.current[index] = el}
                                className="text-8xl md:text-[15rem] font-bold leading-none tracking- px-0"
                                style={{
                                    background: 'linear-gradient(0deg, #000000 -50%, #fff 50%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                0
                            </span>
                            <span className="text-xl md:text-4xl font-medium text-gray-100 tracking-wide">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ImpactStats;
