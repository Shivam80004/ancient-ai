'use client';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const testimonialRef = useRef(null);
    const containerRef = useRef(null);
    const dragStartX = useRef(0);
    const isDragging = useRef(false);
    const autoPlayInterval = useRef(null);

    const testimonials = [
        {
            quote: "Mount Media has proven time and time again that they are the industry leaders in high quality iGaming PPC traffic. Their account managers are available around the clock and always willing to assist our every request.",
            author: "Mio Media",
            company: "Digital Marketing"
        },
        {
            quote: "Working with this team has transformed our approach to AI-driven solutions. Their expertise in ancient wisdom combined with modern technology is truly revolutionary.",
            author: "Sarah Chen",
            company: "Tech Innovations Inc"
        },
        {
            quote: "The depth of knowledge and spiritual insight provided through this platform has been life-changing. Highly recommend to anyone seeking authentic growth.",
            author: "Raj Kumar",
            company: "Wellness Center"
        },
        {
            quote: "An exceptional platform that bridges the gap between traditional wisdom and contemporary needs. The results speak for themselves.",
            author: "Emily Rodriguez",
            company: "Mindful Living"
        }
    ];

    const partnerLogos = [
        "IIT Bombay", "MIT Bombay", "ICT Mumbai", "Harvard University", "Stanford University", "Berkeley University",
        "IIT Bombay", "MIT Bombay", "ICT Mumbai", "Harvard University", "Stanford University", "Berkeley University"
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
        }, 5000);
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
                // Swipe left - next
                nextTestimonial();
            } else {
                // Swipe right - previous
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
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
            );
        }
    }, [currentIndex]);

    return (
        <section className="relative py-16 md:py-32 bg-black overflow-hidden">
            {/* Background Marquee Logos - Top */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="marquee-container w-full overflow-hidden">
                    <div className="marquee-track flex gap-16 animate-marquee">
                        {partnerLogos.map((logo, i) => (
                            <div
                                key={i}
                                className="text-white/40 text-2xl md:text-4xl font-bold whitespace-nowrap tracking-wider"
                            >
                                {logo}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Background Marquee Logos - Bottom (reversed) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-32">
                <div className="marquee-container w-full overflow-hidden">
                    <div className="marquee-track flex gap-16 animate-marquee-reverse">
                        {partnerLogos.map((logo, i) => (
                            <div
                                key={i}
                                className="text-white/40 text-2xl md:text-4xl font-bold whitespace-nowrap tracking-wider"
                            >
                                {logo}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4">

                <h3 className="text-3xl text-center md:text-5xl lg:text-6xl font-light text-white mb-12 md:mb-28">
                    Stories of
                    <span className="text-3xl text-center md:text-5xl lg:text-6xl font-semibold text-white">&nbsp;Transformation</span>
                </h3>

                {/* Testimonial Card Container */}
                <div
                    ref={containerRef}
                    className="max-w-4xl mx-auto relative cursor-grab active:cursor-grabbing"
                    onMouseDown={handleDragStart}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={() => { isDragging.current = false; startAutoPlay(); }}
                    onTouchStart={handleDragStart}
                    onTouchEnd={handleDragEnd}
                >
                    {/* Decorative Card Stack Effect - Hidden on mobile */}
                    <div className="hidden md:block absolute right-24 -top-2 rotate-3 w-full h-[90%] max-w-2xl rounded-2xl backdrop-blur-sm border border-orange-500/20 -z-10"
                        style={{
                            backgroundImage: 'linear-gradient(272deg, rgba(255, 33, 33, 0) -16.91%, #ff3407 -.51%, #fc964c 12.46%, #fc964c 22.5%, #f62f03 46.54%, rgba(246, 32, 3, 0) 71.84%, #fd7c34 112.33%)'
                        }}
                    ></div>
                    {/* <div className="absolute -right-8 top-8 w-full h-full bg-linear-to-br from-orange-500/10 to-orange-300/5 rounded-2xl backdrop-blur-sm border border-orange-500/10 -z-20"></div> */}

                    {/* Main Testimonial Card */}
                    <div
                        ref={testimonialRef}
                        className="relative bg-linear-to-br h-auto bg-black/80 backdrop-blur-sm max-w-2xl mx-auto p-8 md:p-16 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                    >
                        {/* Quote Icon */}
                        <div className="absolute top-4 left-4 md:left-16 font-serif text-4xl md:text-5xl leading-none quote">
                            ,,
                        </div>
                        <br />

                        {/* Orange Accent Line */}
                        {/* <div className="absolute top-0 right-0 w-32 h-1 bg-linear-to-r from-transparent via-orange-500 to-orange-600"></div> */}

                        {/* Testimonial Content */}
                        <div className="relative z-10">
                            <p className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed mb-6 md:mb-8 font-light">
                                {testimonials[currentIndex].quote}
                            </p>

                            {/* Author Info */}
                            <div className="border-t border-orange-500/30 pt-4 md:pt-6">
                                <h4 className="text-lg md:text-xl font-semibold text-white mb-1">
                                    {testimonials[currentIndex].author}
                                </h4>
                                <p className="text-sm text-white/60">
                                    {testimonials[currentIndex].company}
                                </p>
                            </div>
                        </div>

                        {/* Decorative Corner Element */}
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-linear-to-tl from-orange-500/10 to-transparent"></div>
                    </div>

                    {/* Carousel Indicators */}
                    <div className="flex justify-center gap-3 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToTestimonial(index)}
                                className={`transition-all duration-300 rounded-full ${index === currentIndex
                                    ? 'w-12 h-1.5 bg-orange-500'
                                    : 'w-3 h-1.5 bg-white/30 hover:bg-white/50'
                                    }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .marquee-container {
                    position: relative;
                }
                
                .marquee-track {
                    display: flex;
                    width: max-content;
                }
                
                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                
                @keyframes marquee-reverse {
                    0% {
                        transform: translateX(-50%);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
                
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                
                .animate-marquee-reverse {
                    animation: marquee-reverse 30s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default Testimonials;
