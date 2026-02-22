'use client';
import React, { useState } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import Link from 'next/link';

const CallToAction = () => {
    const [hoveredCard, setHoveredCard] = useState(null);

    const handleMouseEnter = (index, e) => {
        setHoveredCard(index);
        const card = e.currentTarget;
        gsap.to(card, {
            scale: 1.02,
            duration: 0.4,
            ease: 'power2.out'
        });
    };

    const handleMouseLeave = (e) => {
        setHoveredCard(null);
        const card = e.currentTarget;
        gsap.to(card, {
            scale: 1,
            duration: 0.4,
            ease: 'power2.out'
        });
    };

    const cards = [
        {
            title: "Community of",
            titleHighlight: "like-minded individuals",
            description: "Connect with a vibrant community that shares your passion for growth and spiritual awakening",
            buttonText: "Join Community",
            link: "/contact-us",
        },
        {
            title: "Weekly",
            titleHighlight: "Masterclass",
            description: "Attend transformative sessions with experts who guide you deeper into ancient wisdom",
            buttonText: "Register Now",
            link: "https://luma.com/v1c0ijh0",
        }
    ];

    return (
        <section className="relative py-20 md:py-32 bg-black overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="justify-center md:max-w-[57vw] mb-9 md:flex-nowrap !flex-wrap !flex mx-auto">
                    <h3 className="text-3xl text-center md:text-5xl lg:text-6xl font-light text-white inline-block">
                        Ready to enter the revolution <span className="md:hidden inline-block">of</span>
                    </h3>
                    <h3 className="text-3xl md:inline-block hidden text-center mt-2 md:text-5xl lg:text-6xl font-light text-white">
                        of
                    </h3>
                    <span className='transform -translate-y-2 translate-x-3 inline-block'>
                        <Image src="/logo-plain.png" alt="Revolution" width={260} height={250} />
                    </span>
                    <h3 className="text-3xl hidden text-center pl-6 mt-0.5 md:text-5xl lg:text-6xl font-light text-white md:inline-block">
                        ?
                    </h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
                    {cards.map((card, index) => (
                        <Link
                            key={index}
                            href={card.link}
                            {...(card.link.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            className="cta-card relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 border border-white/10"
                            onMouseEnter={(e) => handleMouseEnter(index, e)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {/* Dark Background (Initial State) */}
                            <div
                                className={`absolute inset-0 bg-zinc-900/95 transition-opacity duration-700 ${hoveredCard === index ? 'opacity-0' : 'opacity-100'
                                    }`}
                            />

                            {/* Gradient Background (Hover State) */}
                            <div
                                className={`absolute inset-0 transition-opacity duration-700 ${hoveredCard === index ? 'md:opacity-100 opacity-100' : 'md:opacity-0 opacity-100'
                                    }`}
                                style={{
                                    background: 'linear-gradient(261.26deg, rgba(246, 32, 3, 0) -11.86%, #fc964c -5.96%, #fc964c 5.45%, #f62003 30.99%, rgba(246, 32, 3, 0) 62.85%, #f62003 101.39%, #fd7c34 103.82%)'
                                }}
                            />

                            {/* Content */}
                            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8 md:p-12">
                                <div className="mb-6">
                                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-2">
                                        {card.title}
                                    </h3>
                                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white">
                                        {card.titleHighlight}
                                    </h3>
                                </div>

                                <p className="text-base md:text-lg text-white/80 max-w-md mb-8 leading-relaxed">
                                    {card.description}
                                </p>

                                {/* CTA Button */}
                                <div
                                    className={`
                                        relative px-8 py-3 rounded-full font-medium text-base
                                        transition-all duration-300
                                        ${hoveredCard === index
                                            ? 'bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30'
                                            : 'bg-white/10 backdrop-blur-sm text-white/70 border border-white/20 hover:bg-white/20'
                                        }
                                    `}
                                >
                                    {card.buttonText}
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl transition-opacity duration-700 ${hoveredCard === index ? 'opacity-0' : 'opacity-100'
                                }`} />
                            <div className={`absolute bottom-0 left-0 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl transition-opacity duration-700 ${hoveredCard === index ? 'opacity-0' : 'opacity-100'
                                }`} />
                        </Link>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .cta-card {
                    transform-style: preserve-3d;
                }
                
                .cta-card::before {
                    content: '';
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    right: -2px;
                    bottom: -2px;
                    background: linear-gradient(45deg, transparent, rgba(255, 123, 0, 0.3), transparent);
                    border-radius: 1.5rem;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                    z-index: -1;
                }
                
                .cta-card:hover::before {
                    opacity: 1;
                }
            `}</style>
        </section>
    );
};

export default CallToAction;
