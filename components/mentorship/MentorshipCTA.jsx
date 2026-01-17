'use client';
import React, { useRef } from 'react';
import gsap from 'gsap';
import MagneticButton from '../ui/MagneticButton';

const MentorshipCTA = () => {
    const btnRef = useRef(null);
    const textRef = useRef(null);

    const handleMouseEnter = () => {
        gsap.to(btnRef.current, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
        gsap.to(btnRef.current, { scale: 1, duration: 0.3, ease: 'power2.out' });
    };

    return (
        <section className="py-24 px-4 bg-black relative overflow-hidden">
            {/* Background Gradient Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full blur-[120px] pointer-events-none  bg-gradient-to-br from-[#F62003] via-[#000000] to-[#F62003]"
            />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <h2 className="text-5xl md:text-6xl font-light text-white mb-8 tracking-tight">
                    Ready to <span className="font-semibold text-transparent bg-clip-text bg-white">Transform</span> Your Life?
                </h2>
                <p className="text-xl text-white mb-12 max-w-2xl mx-auto leading-relaxed">
                    Join a mentorship program today and start your journey towards self-mastery, spiritual growth, and lasting fulfillment.
                </p>

                <span className="flex justify-center">
                    <MagneticButton link="/contact-us" text="Apply for Mentorship" />
                </span>
            </div>
        </section>
    );
};

export default MentorshipCTA;
