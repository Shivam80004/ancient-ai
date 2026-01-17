'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const tabsRef = useRef([]);
    const [activeRect, setActiveRect] = useState({ left: 0, width: 0, opacity: 0 });

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const navLinks = [
        { href: '/who-we-are', label: 'Who We Are' },
        { href: '/mentorship', label: 'Mentorship' },
        { href: '/courses', label: 'Courses' },
        { href: '/free-resources', label: 'Free Resources' },
        { href: '/trips', label: 'Trips' },
        { href: '/our-inspiration', label: 'Our Inspiration' },
        { href: '/contact-us', label: 'Contact Us' },
    ];

    useEffect(() => {
        const activeTabIndex = navLinks.findIndex(link => link.href === pathname);
        const activeTab = tabsRef.current[activeTabIndex];

        if (activeTab) {
            setActiveRect({
                left: activeTab.offsetLeft,
                width: activeTab.offsetWidth,
                opacity: 1
            });
        } else {
            setActiveRect(prev => ({ ...prev, opacity: 0 }));
        }
    }, [pathname]);

    const handleMouseEnter = (index) => {
        const tab = tabsRef.current[index];
        if (tab) {
            setActiveRect({
                left: tab.offsetLeft,
                width: tab.offsetWidth,
                opacity: 1
            });
        }
    };

    const handleMouseLeave = () => {
        const activeTabIndex = navLinks.findIndex(link => link.href === pathname);
        const activeTab = tabsRef.current[activeTabIndex];

        if (activeTab) {
            setActiveRect({
                left: activeTab.offsetLeft,
                width: activeTab.offsetWidth,
                opacity: 1
            });
        } else {
            setActiveRect(prev => ({ ...prev, opacity: 0 }));
        }
    };

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="hidden md:flex fixed top-8 left-1/2 -translate-x-1/2 z-50 w-max px-2 py-2">
                <div className="flex items-center gap-8 px-8 py-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 shadow-2xl relative">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-2 group mr-4 relative z-20">
                        <img
                            src="/logo.svg"
                            alt="Logo"
                            className="h-9 w-auto opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                        />
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-1 relative" onMouseLeave={handleMouseLeave}>
                        {/* Sliding Highlight */}
                        <div
                            className="absolute top-0 bottom-0 rounded-full bg-linear-to-r from-orange-600/80 to-red-600/80 transition-all duration-300 ease-out z-0 blur-[2px]"
                            style={{
                                left: activeRect.left,
                                width: activeRect.width,
                                opacity: activeRect.opacity,
                                height: '100%'
                            }}
                        />
                        <div
                            className="absolute top-0 bottom-0 rounded-full border border-white/20 transition-all duration-300 ease-out z-0"
                            style={{
                                left: activeRect.left,
                                width: activeRect.width,
                                opacity: activeRect.opacity,
                                height: '100%'
                            }}
                        />

                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                ref={el => tabsRef.current[index] = el}
                                onMouseEnter={() => handleMouseEnter(index)}
                                className={`relative z-10 px-5 py-2 rounded-full text-sm font-light tracking-wide transition-colors duration-300 
                                    ${pathname === link.href ? 'text-white font-medium' : 'text-white/70 hover:text-white'}
                                `}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Mobile Navbar */}
            <nav className="md:hidden fixed top-4 left-4 right-4 z-50">
                <div className="flex items-center justify-between px-6 py-4 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
                    {/* Logo */}
                    <Link href="/" className="flex items-center" onClick={closeMobileMenu}>
                        <img
                            src="/logo.svg"
                            alt="Logo"
                            className="h-8 w-auto brightness-0 invert opacity-90"
                        />
                    </Link>

                    {/* Hamburger Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="relative w-8 h-8 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
                    >
                        <span className={`block w-6 h-0.5 bg-white/90 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-white/90 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-white/90 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                <div className={`mt-2 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-500 ${mobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col py-4 px-2">
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                onClick={closeMobileMenu}
                                className="px-6 py-4 text-white/80 font-light text-lg transition-all duration-200 hover:text-white hover:bg-white/5 rounded-xl flex items-center justify-between group"
                            >
                                {link.label}
                                <span className="opacity-0 group-hover:opacity-100 text-orange-500 transition-opacity duration-300">→</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Backdrop */}
            {mobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={closeMobileMenu}
                />
            )}
        </>
    );
};

export default Navbar;
