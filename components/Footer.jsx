'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const Footer = () => {
    const footerRef = useRef(null);
    const logoRef = useRef(null);
    const glowRef = useRef(null);
    const linksRef = useRef(null);

    const footerLinks = [
        {
            title: "SITEMAP",
            links: ["Home", "Experience", "The Illusion"]
        },
        {
            title: "SOCIALS",
            links: ["Twitter", "LinkedIn", "Instagram", "GitHub"]
        },
        {
            title: "LEGAL",
            links: ["Privacy Policy", "Terms of Service", "Cookie Policy"]
        },
        {
            title: "CONTACT",
            links: ["hello@ancient.ai", "Support", "Join the Team"]
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Sunrise Animation
            gsap.fromTo(glowRef.current,
                {
                    y: 100,
                    opacity: 0,
                    scale: 0.8
                },
                {
                    y: 0,
                    opacity: 0.8,
                    scale: 1,
                    duration: 2.5,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 80%",
                        end: "bottom bottom",
                        scrub: 1,
                    }
                }
            );

            // Logo Reveal
            gsap.fromTo(logoRef.current,
                {
                    y: 200,
                    opacity: 0,
                },
                {
                    y: 70,
                    opacity: 1,
                    duration: 2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "50% 70%",
                    }
                }
            );

            // Links Stagger
            const links = linksRef.current.querySelectorAll('.footer-column');
            gsap.fromTo(links,
                {
                    y: 30,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: linksRef.current,
                        start: "top 85%",
                    }
                }
            );
        }, footerRef);

        return () => ctx.revert();
    }, []);

    return (
        <footer ref={footerRef} className="relative bg-[#0a0a0a] text-white pt-32 pb-10 overflow-hidden border-t border-white/5">
            <div className="container mx-auto px-6 relative z-10">
                {/* Links Grid */}
                <div ref={linksRef} className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-20 mb-32">
                    {footerLinks.map((section, idx) => (
                        <div key={idx} className="footer-column flex flex-col gap-6">
                            <h4 className="text-xs font-bold tracking-widest text-white/40 uppercase">
                                {section.title}
                            </h4>
                            <ul className="flex flex-col gap-4">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a
                                            href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="text-sm md:text-base text-white/70 hover:text-white transition-colors duration-300"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Big Logo with Sun Rise Effect */}
                <div className="relative mt-20 flex flex-col items-center">
                    <div ref={logoRef} className="relative z-10 w-full max-w-6xl mx-auto overflow-hidden">
                        <img
                            src="/logo.svg"
                            alt="Ancient AI Logo"
                            className="footer-logo w-full h-auto object-contain brightness-0 invert"
                        />
                    </div>

                    {/* Sunrise Glow - Half Curve Sun */}
                    <div ref={glowRef} className="absolute z-0! top-[10px] w-screen aspect-square pointer-events-none">
                        <div className="absolute inset-0 bg-linear-to-b from-[#ff720d] via-[#ff720d]/40 to-transparent blur-[100px] rounded-full opacity-60"></div>
                        <div className="absolute top-0 left-1/2 opacity-10 -translate-x-1/2 w-full h-full rounded-full border-b-4 border-[#ff720d] shadow-[0_-20px_80px_rgba(255,114,13,0.5)]"></div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="relative z-30 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] md:text-xs text-white/30 uppercase tracking-[0.2em]">
                    <p>© 2025 Ancient AI. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                    </div>
                </div>
            </div>

            {/* <style jsx>{`
                .footer-logo {
                    mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.2) 100%);
                    -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.2) 100%);
                }
            `}</style> */}
        </footer>
    );
};

export default Footer;
