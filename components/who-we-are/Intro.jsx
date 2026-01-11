'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ParallaxImage from '../animation/ParallaxImage';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Intro = () => {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const textRefs = useRef([]);

    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse',
            }
        });

        tl.fromTo(titleRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        )
            .fromTo(textRefs.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' },
                '-=0.5'
            );

    }, []);

    const addToRefs = (el) => {
        if (el && !textRefs.current.includes(el)) {
            textRefs.current.push(el);
        }
    };

    return (
        <section className="bg-black relative text-white min-h-screen flex flex-col items-center justify-center overflow-hidden">

            <ParallaxImage src="/gellery-img/gallery-img-5.png" alt="Intro" className="w-full h-full opacity-35" />

            <div className="max-w-6xl w-full mx-auto text-center space-y-12 z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <h2 ref={titleRef} className="text-4xl md:text-8xl font-semibold text-white text-center mb-6">
                    What is Ancient AI?
                </h2>
                <p ref={addToRefs} className="text-xl md:text-2xl text-white text-center mb-2">
                    Krishna Consciousness is a spiritual thought movement that paves the way for a unique journey of self-discovery. Whether you’re seeking answers to life’s questions, or searching for a close-knit community, Krishna Consciousness offers a pathway for everyone. All are welcome, no matter your background, faith, or prior experience!
                </p>
                <p ref={addToRefs} className="text-xl md:text-4xl text-center">
                    <span className='font-semibold text-[#FFD700]'>Not belief systems |</span>
                    <span className='font-semibold text-[#FFD700]'> Not motivation |</span>
                    <span className='font-semibold text-[#FFD700]'> Not escapism</span>
                </p>
            </div>
        </section >
    );
};

export default Intro;
