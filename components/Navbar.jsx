'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const navLinks = [
        { href: '/#experience', label: 'Experience' },
        { href: '/about', label: 'About Us' },
        { href: '/#the-illusion', label: 'The Illusion' },
    ];

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="hidden md:flex fixed top-8 left-1/2 -translate-x-1/2 z-50 w-fit px-2 py-2">
                <div className="flex items-center gap-18 px-6 py-2 rounded-2xl bg-white/10 backdrop-blur-sm shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <img
                            src="/logo.svg"
                            alt="Logo"
                            className="h-11 w-auto brightness-0 invert transition-transform duration-300"
                        />
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-2">
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className="px-6 py-2 rounded-xl text-white/70 font-popinse font-medium text-sm transition-all duration-300 hover:text-white"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Mobile Navbar */}
            <nav className="md:hidden fixed top-4 left-4 right-4 z-50">
                <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                    {/* Logo */}
                    <Link href="/" className="flex items-center" onClick={closeMobileMenu}>
                        <img
                            src="/logo.svg"
                            alt="Logo"
                            className="h-8 w-auto brightness-0 invert"
                        />
                    </Link>

                    {/* Hamburger Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="relative w-8 h-8 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        <span
                            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                                }`}
                        />
                        <span
                            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''
                                }`}
                        />
                        <span
                            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                                }`}
                        />
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                <div
                    className={`mt-2 rounded-2xl bg-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="flex flex-col py-2">
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                onClick={closeMobileMenu}
                                className="px-6 py-3 text-white/70 font-popinse font-medium text-sm transition-all duration-200 hover:text-white hover:bg-white/5 active:bg-white/10"
                            >
                                {link.label}
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
