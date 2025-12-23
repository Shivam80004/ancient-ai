'use client';

import React from 'react';
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-fit px-2 py-2">
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
                    <Link
                        href="#"
                        className="px-6 py-2 rounded-xl text-white/70 font-popinse font-medium text-sm transition-all duration-300 hover:text-white"
                    >
                        Full view
                    </Link>
                    <Link
                        href="#"
                        className="px-6 py-2 rounded-full text-white/70 font-popinse font-medium text-sm transition-all duration-300 hover:text-white"
                    >
                        Overview
                    </Link>
                    <Link
                        href="#"
                        className="px-6 py-2 rounded-full text-white/70 font-popinse font-medium text-sm transition-all duration-300 hover:text-white"
                    >
                        Gallery
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
