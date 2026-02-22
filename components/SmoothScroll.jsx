'use client';

import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
    useEffect(() => {
        // Synchronous require so Lenis is instantiated before any user interaction.
        // Next.js bundles this at build time — no async network gap.
        const LenisModule = require('lenis');
        const Lenis = LenisModule.default || LenisModule;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        // Official Lenis v1 + GSAP pattern:
        // Drive Lenis with its own native RAF, and update ScrollTrigger inside it.
        // This avoids the timing desync that happens when using gsap.ticker.
        let rafId;
        function raf(time) {
            lenis.raf(time);
            ScrollTrigger.update();
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        // After Lenis+RAF is running, refresh all ScrollTrigger instances so they
        // recalculate their positions using Lenis scroll state (not raw window.scrollY).
        // Without this, RevealText / parallax triggers are offset on first scroll.
        ScrollTrigger.refresh();

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
