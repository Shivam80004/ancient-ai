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

    const footerLinks = [
        {
            title: "SITEMAP",
            links: [
                { name: "Home", href: "/" },
                { name: "Who We Are", href: "/about" },
                { name: "Events & Mentorship", href: "/events-and-mentorship" },
                { name: "Courses", href: "/courses" },
                { name: "Free Resources", href: "/free-resources" },
                { name: "Retreats", href: "/retreats" },
                { name: "Our Inspiration", href: "/our-inspiration" },
                { name: "Contact Us", href: "/contact-us" },
            ]
        },
        // {
        //     title: "SOCIALS",
        //     links: [
        //         { name: "Twitter", href: "#" },
        //         { name: "LinkedIn", href: "#" },
        //         { name: "Instagram", href: "#" },
        //         { name: "YouTube", href: "#" },
        //     ]
        // },
        {
            title: "LEGAL",
            links: [
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Terms of Service", href: "/terms-of-service" },
                { name: "Cookie Policy", href: "/cookie-policy" },
            ]
        },
        {
            title: "CONTACT",
            links: [
                { name: "support@ancient.ai", href: "mailto:support@ancient.ai" },
                { name: "Join the Team", href: "/contact-us" },
            ]
        }
    ];

    React.useLayoutEffect(() => {
        if (!footerRef.current) return;

        const ctx = gsap.context(() => {
            // Create a master timeline with a single ScrollTrigger
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 0%",
                    end: "top 20%",
                    toggleActions: "play none none reverse",
                }
            });

            // Logo Reveal - Fade up
            if (logoRef.current) {
                tl.fromTo(logoRef.current,
                    {
                        y: 100,
                        opacity: 0,
                    },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1.5,
                        ease: "power3.out",
                    }
                );
            }
        }, footerRef);

        return () => ctx.revert();
    }, []);

    return (
        <footer ref={footerRef} className="relative bg-[#0a0a0a] text-white pt-32 pb-10 overflow-hidden border-t border-white/5">
            <div className="container max-w-7xl mx-auto px-6 relative z-10">
                {/* Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-20 mb-32">
                    {footerLinks.map((section, idx) => (
                        <div key={idx} className="footer-column flex flex-col gap-6">
                            <h4 className="text-xs font-bold tracking-widest text-white/40 uppercase">
                                {section.title}
                            </h4>
                            <ul className="flex flex-col gap-4">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a
                                            href={link.href}
                                            className="text-sm md:text-base text-white/70 hover:text-white transition-colors duration-300"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Big Logo */}
                <div className="relative mt-20 flex flex-col items-center">
                    <div ref={logoRef} className="relative z-10 w-full max-w-6xl mx-auto overflow-hidden">
                        <img
                            src="/logo.svg"
                            alt="Ancient AI Logo"
                            className="footer-logo w-full h-auto object-contain"
                        />
                    </div>
                    {/* Sunrise Glow - Half Curve Sun */}
                    <div className="absolute z-0! top-[10px] w-screen aspect-square pointer-events-none">
                        <div className="absolute inset-0 blur-[100px] rounded-full opacity-60"
                            style={{
                                backgroundImage: 'linear-gradient(261.26deg, #ff6a00 -11.86%, #fc964c -5.96%, #fc964c 5.45%, #f62003 30.99%, #ff6a00 62.85%, #f62003 101.39%, #fd7c34 103.82%)'
                            }}
                        ></div>
                        <div className="absolute top-0 left-1/2 opacity-10 -translate-x-1/2 w-full h-full rounded-full border-b-4 border-[#ff6a00] shadow-[0_-20px_80px_rgba(255,114,13,0.5)]"></div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="relative z-30 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] md:text-xs text-white/30 uppercase tracking-[0.2em]">
                    <p>© 2026 Ancient AI. All rights reserved.</p>
                    {/* Social links — coming soon */}
                    {/* <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                    </div> */}
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
