'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const MagneticButton = ({ text = "Explore more", link = "#explore", className = "" }) => {
    const magneticBtnRef = useRef(null);
    const magneticInnerRef = useRef(null);

    useEffect(() => {
        const initMagnetic = () => {
            if (window.innerWidth <= 991) return;

            const m = magneticBtnRef.current;
            const inner = magneticInnerRef.current;
            if (!m) return;

            const resetEl = (el, immediate) => {
                if (!el) return;
                gsap.killTweensOf(el);
                (immediate ? gsap.set : gsap.to)(el, {
                    x: "0em",
                    y: "0em",
                    rotate: "0deg",
                    clearProps: "all",
                    ...(!immediate && { ease: "elastic.out(1, 0.3)", duration: 1.6 })
                });
            };

            const handleMouseEnter = () => {
                resetEl(m, true);
                resetEl(inner, true);
            };

            const handleMouseMove = (e) => {
                const b = m.getBoundingClientRect();
                const strength = 50;
                const strengthInner = 25;

                // Calculate position relative to center of button
                const offsetX = ((e.clientX - b.left) / m.offsetWidth - 0.5) * (strength / 16);
                const offsetY = ((e.clientY - b.top) / m.offsetHeight - 0.5) * (strength / 16);

                gsap.to(m, {
                    x: offsetX + "em",
                    y: offsetY + "em",
                    rotate: "0.001deg",
                    ease: "power4.out",
                    duration: 1.6
                });

                if (inner) {
                    const innerOffsetX = ((e.clientX - b.left) / m.offsetWidth - 0.5) * (strengthInner / 16);
                    const innerOffsetY = ((e.clientY - b.top) / m.offsetHeight - 0.5) * (strengthInner / 16);

                    gsap.to(inner, {
                        x: innerOffsetX + "em",
                        y: innerOffsetY + "em",
                        rotate: "0.001deg",
                        ease: "power4.out",
                        duration: 2
                    });
                }
            };

            const handleMouseLeave = () => {
                resetEl(m);
                resetEl(inner);
            };

            m.addEventListener('mouseenter', handleMouseEnter);
            m.addEventListener('mousemove', handleMouseMove);
            m.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                m.removeEventListener('mouseenter', handleMouseEnter);
                m.removeEventListener('mousemove', handleMouseMove);
                m.removeEventListener('mouseleave', handleMouseLeave);
            };
        };

        const cleanup = initMagnetic();
        return () => {
            if (cleanup) cleanup();
        };
    }, []);

    return (
        <div className={`btn-magnetic ${className}`}>
            <a
                href={link}
                ref={magneticBtnRef}
                className="btn-magnetic__click"
            >
                <div className="btn-magnetic__fill"></div>
                <div ref={magneticInnerRef} className="btn-magnetic__content">
                    <div className="btn-magnetic__text">
                        <p className="btn-magnetic__text-p">{text}</p>
                        <p className="btn-magnetic__text-p is--duplicate">{text}</p>
                    </div>
                </div>
            </a>
        </div>
    );
};

export default MagneticButton;
