
'use client';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const testimonialRef = useRef(null);
    const containerRef = useRef(null);
    const dragStartX = useRef(0);
    const isDragging = useRef(false);
    const autoPlayInterval = useRef(null);

    const testimonials = [
        // {
        //     quote: "Ancient AI helped me reconnect with timeless wisdom in a way that fits my modern lifestyle. My clarity and inner peace have grown beyond what I imagined possible.",
        //     author: "Arjun Mehta",
        //     company: "Software Engineer, Bangalore",
        //     image: "/images/testimonial/testimonial-person-1.png",
        //     statLabel: "Consciousness Level",
        //     statValue: "80%",
        //     statChange: "+80% in the last 6 months",
        //     statStatus: "Excellent",
        // },
        {
            quote: "Working with this platform has transformed my approach to life. The blend of ancient wisdom and modern technology is truly revolutionary — I feel more grounded every day.",
            author: "Ashtesh Kumar",
            company: "Co-Founder & CTO, Manastu Space, IIT Bombay",
            image: "/images/testimonial/testimonial-person-2.png",
            statLabel: "Life Purpose",
            statValue: "3mo",
            statChange: "Found direction in 3 months",
            statStatus: "Great",
        },
        {
            quote: "The depth of knowledge and spiritual insight provided through this platform has been life-changing. I've discovered a level of self-awareness I never knew existed.",
            author: "Raj Kumar",
            company: "Wellness Coach, Delhi",
            image: "/images/testimonial/testimonial-person-3.png",
            statLabel: "Meditation Streak",
            statValue: "90%",
            statChange: "+90% consistency improvement",
            statStatus: "Excellent",
        },
        {
            quote: "An exceptional platform that bridges the gap between traditional wisdom and contemporary needs. My stress levels dropped dramatically and my relationships improved.",
            author: "Emily Rodriguez",
            company: "Mindful Living, USA",
            image: "/images/testimonial/testimonial-person-4.png",
            statLabel: "Anxiety Reduced",
            statValue: "70%",
            statChange: "+70% improvement naturally",
            statStatus: "Good",
        },
        {
            quote: "An exceptional platform that bridges the gap between traditional wisdom and contemporary needs. My stress levels dropped dramatically and my relationships improved.",
            author: "Emily Rodriguez",
            company: "Mindful Living, USA",
            image: "/images/testimonial/testimonial-person-5.png",
            statLabel: "Anxiety Reduced",
            statValue: "70%",
            statChange: "+70% improvement naturally",
            statStatus: "Good",
        },
    ];

    // Auto-play functionality
    useEffect(() => {
        startAutoPlay();
        return () => stopAutoPlay();
    }, [currentIndex]);

    const startAutoPlay = () => {
        stopAutoPlay();
        autoPlayInterval.current = setInterval(() => {
            nextTestimonial();
        }, 6000);
    };

    const stopAutoPlay = () => {
        if (autoPlayInterval.current) {
            clearInterval(autoPlayInterval.current);
        }
    };

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const goToTestimonial = (index) => {
        setCurrentIndex(index);
        startAutoPlay();
    };

    // Drag functionality
    const handleDragStart = (e) => {
        isDragging.current = true;
        dragStartX.current = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        stopAutoPlay();
    };

    const handleDragEnd = (e) => {
        if (!isDragging.current) return;

        const dragEndX = e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX;
        const diff = dragStartX.current - dragEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextTestimonial();
            } else {
                setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
            }
        }

        isDragging.current = false;
        startAutoPlay();
    };

    // Animate testimonial change
    useEffect(() => {
        if (testimonialRef.current) {
            gsap.fromTo(
                testimonialRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
            );
        }
    }, [currentIndex]);

    return (
        <section className="relative py-16 md:py-32 bg-black overflow-hidden">
            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4">

                <h3 className="text-3xl text-center md:text-5xl lg:text-6xl font-light text-white mb-12 md:mb-28">
                    People Sharing Better
                    <span className="text-3xl text-center md:text-5xl lg:text-6xl font-semibold text-white">&nbsp;Experiences</span>
                </h3>

                {/* Testimonial Card Container */}
                <div
                    ref={containerRef}
                    className="max-w-6xl mx-auto relative cursor-grab active:cursor-grabbing select-none"
                    onMouseDown={handleDragStart}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={() => { isDragging.current = false; startAutoPlay(); }}
                    onTouchStart={handleDragStart}
                    onTouchEnd={handleDragEnd}
                >
                    {/* Decorative Card Stack Effect - Hidden on mobile */}
                    <div className="hidden md:block absolute right-16 -top-3 rotate-[2.5deg] w-full h-[85%] max-w-5xl rounded-3xl backdrop-blur-sm border border-orange-500/20 -z-10"
                        style={{
                            backgroundImage: 'linear-gradient(272deg, rgba(255, 33, 33, 0) -16.91%, #ff3407 -.51%, #fc964c 12.46%, #fc964c 22.5%, #f62f03 46.54%, rgba(246, 32, 3, 0) 71.84%, #fd7c34 112.33%)'
                        }}
                    ></div>

                    {/* Main Testimonial Card */}
                    <div
                        ref={testimonialRef}
                        className="relative bg-black/90 backdrop-blur-xl max-w-5xl mx-auto rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row min-h-[340px] md:min-h-[420px]">

                            {/* Right - Person Image */}
                            <div className="relative w-full md:w-[320px] lg:w-[380px] flex-shrink-0 overflow-hidden">
                                {/* Gradient overlay on image */}
                                <div className="absolute inset-0 z-10"
                                // style={{
                                //     background: 'linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 30%, transparent 60%)',
                                // }}
                                />
                                {/* Bottom fade */}
                                <div className="absolute bottom-0 left-0 right-0 h-24 z-10"
                                    style={{
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                                    }}
                                />
                                {/* Orange tint overlay */}
                                <div className="absolute inset-0 z-[5] opacity-20 mix-blend-color"
                                    style={{
                                        background: 'linear-gradient(180deg, transparent 40%, #f62003 100%)',
                                    }}
                                />

                                <Image
                                    src={testimonials[currentIndex].image}
                                    alt={testimonials[currentIndex].author}
                                    fill
                                    className="object-cover object-top"
                                    sizes="(max-width: 768px) 100vw, 380px"
                                />
                            </div>


                            {/* Left - Text Content */}
                            <div className="flex-1 p-8 md:p-14 flex flex-col justify-between">
                                {/* Quote Icon */}
                                <div>
                                    <div className="font-serif text-5xl md:text-6xl leading-none text-white/20"
                                        style={{ fontFamily: 'Georgia, serif' }}
                                    >
                                        &ldquo;
                                    </div>


                                    {/* Quote Text */}
                                    <p className="text-base md:text-lg lg:text-xl text-white/85 leading-relaxed mb-8 font-light">
                                        {testimonials[currentIndex].quote}
                                    </p>
                                </div>

                                {/* Author Info */}
                                <div className="border-t border-white/10 pt-5">
                                    <h4 className="text-lg md:text-xl font-semibold text-white mb-1">
                                        {testimonials[currentIndex].author}
                                    </h4>
                                    <p className="text-sm text-white/50">
                                        {testimonials[currentIndex].company}
                                    </p>
                                </div>
                            </div>


                        </div>
                    </div>

                    {/* Persona Badge - Floating Bottom Element */}
                    {/* Stat Card Widget - Floating Bottom */}
                    <div
                        className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20 rounded-2xl overflow-hidden"
                        style={{
                            background: 'rgba(0, 0, 0, 0.45)',
                            backdropFilter: 'blur(24px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.2)',
                        }}
                    >
                        {/* Glass Glare Animation */}
                        <div
                            className="absolute inset-0 z-0 pointer-events-none"
                            style={{
                                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.06) 55%, transparent 70%)',
                                backgroundSize: '200% 100%',
                                animation: 'glassGlare 4s ease-in-out infinite',
                            }}
                        />
                        {/* Top edge highlight */}
                        <div
                            className="absolute top-0 left-[10%] right-[10%] h-[1px] z-0"
                            style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                            }}
                        />

                        <div className="relative z-10 px-7 md:px-9 py-5 md:py-6 min-w-[220px] md:min-w-[280px]">
                            {/* Top Label Row */}
                            <div className="flex items-center gap-2.5 mb-3">
                                {/* Bar chart icon */}
                                <div className="flex items-end gap-[3px] h-4">
                                    <div className="w-[3px] h-[40%] rounded-full bg-orange-500" />
                                    <div className="w-[3px] h-[65%] rounded-full bg-orange-500" />
                                    <div className="w-[3px] h-full rounded-full bg-orange-500" />
                                </div>

                                <span className="text-sm md:text-base font-semibold tracking-tight">
                                    {testimonials[currentIndex].statLabel}
                                </span>

                                {/* Status pill */}
                                {/* <span className="ml-auto px-3 py-0.5 rounded-full text-xs font-semibold"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: testimonials[currentIndex].statStatus === 'Excellent'
                                            ? '#4ade80'
                                            : testimonials[currentIndex].statStatus === 'Great'
                                                ? '#60a5fa'
                                                : '#4ade80',
                                    }}
                                >
                                    {testimonials[currentIndex].statStatus}
                                </span> */}
                            </div>

                            {/* Big Stat Value */}
                            <div className="text-4xl md:text-5xl font-bold text-accent-warm tracking-tight leading-none mb-2"
                                style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}
                            >
                                {testimonials[currentIndex].statValue}
                            </div>

                            {/* Change indicator */}
                            <p className="text-xs md:text-sm text-white/50 font-medium">
                                <span className="text-green-400 font-semibold">↑ </span>
                                {testimonials[currentIndex].statChange}
                            </p>
                        </div>
                    </div>

                    {/* Glass glare keyframes */}
                    {/* <style jsx>{`
                        @keyframes glassGlare {
                            0% { background-position: 200% 0; }
                            50% { background-position: -200% 0; }
                            100% { background-position: 200% 0; }
                        }
                    `}</style> */}



                    {/* Carousel Indicators */}
                    <div className="flex justify-center gap-3 mt-10">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToTestimonial(index)}
                                className={`transition-all duration-500 rounded-full ${index === currentIndex
                                    ? 'w-14 h-2 bg-orange-500 shadow-lg shadow-orange-500/30'
                                    : 'w-3 h-2 bg-white/20 hover:bg-white/40'
                                    }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
