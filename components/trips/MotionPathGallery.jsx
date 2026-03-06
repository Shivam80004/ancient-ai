'use client';
import React, { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import './MotionPathGallery.css';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const DEFAULT_ITEMS = [
    {
        image: '/gellery-img/gallery-img-1.jpg',
        label: 'Experience 001',
        title: 'Vrindavan Yatra',
        slug: 'vrindavan-yatra',
    },
    {
        image: '/gellery-img/gallery-img-2.webp',
        label: 'Experience 002',
        title: 'Mayapur Retreat',
        slug: 'mayapur-retreat',
    },
    {
        image: '/gellery-img/gallery-img-3.jpg',
        label: 'Experience 003',
        title: 'Himalayan Trek',
        slug: 'himalayan-trek',
    },
    {
        image: '/gellery-img/gallery-img-4.jpeg',
        label: 'Experience 004',
        title: 'Govardhan Parikrama',
        slug: 'govardhan-parikrama',
    },
    {
        image: '/gellery-img/gallery-img-5.png',
        label: 'Experience 005',
        title: 'Sacred Ganga Aarti',
        slug: 'sacred-ganga-aarti',
    },
];

function debounce(fn, delay = 200) {
    let timeout;
    return () => {
        clearTimeout(timeout);
        timeout = setTimeout(fn, delay);
    };
}

const MotionPathGallery = ({ items = DEFAULT_ITEMS, title = 'RETREATS' }) => {
    const wrapRef = useRef(null);
    const tlRef = useRef(null);
    const resizeHandlerRef = useRef(null);

    const initAnimation = useCallback(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;

        const path = wrap.querySelector('[data-motionpath="path"]');
        const itemEls = wrap.querySelectorAll('[data-motionpath="item"]');
        const itemDetails = wrap.querySelectorAll('[data-motionpath="item-details"]');

        if (!path || itemEls.length === 0) return;

        // Set z-index on items so 1st item is on top
        gsap.set(itemEls, {
            zIndex: (i, _target, all) => all.length - i,
        });

        // If there's an old timeline, grab its progress, reset it, then kill it
        let progress = 0;
        if (tlRef.current) {
            progress = tlRef.current.progress();
            tlRef.current.progress(0).kill();
        }

        // Create new timeline + ScrollTrigger
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: wrap,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
            },
            defaults: {
                ease: 'none',
                stagger: 0.3,
            },
        });

        tl.to(itemEls, {
            duration: 1,
            motionPath: {
                path,
                align: path,
                curviness: 2,
                alignOrigin: [0.5, 0.5],
            },
        })
            .fromTo(
                itemEls,
                { autoAlpha: 0 },
                { autoAlpha: 1, duration: 0.1 },
                0
            )
            .fromTo(
                itemEls,
                { filter: 'blur(1.5em)' },
                { filter: 'blur(0em)', duration: 0.5 },
                0
            )
            .fromTo(
                itemDetails,
                { autoAlpha: 0, yPercent: 25 },
                { autoAlpha: 1, yPercent: 0, duration: 0.1 },
                0.5
            )
            .fromTo(
                itemEls,
                { scale: 0.4 },
                { scale: 1, duration: 0.65 },
                0
            )
            .to(itemEls, { autoAlpha: 0, filter: 'blur(1em)', duration: 0.15 }, 0.85)
            .to(itemDetails, { autoAlpha: 0, duration: 0.05 }, 0.9);

        // Jump back to previous spot and refresh
        tl.progress(progress);
        ScrollTrigger.refresh();

        tlRef.current = tl;
    }, []);

    useEffect(() => {
        // Small delay to ensure DOM is painted
        const timer = setTimeout(() => {
            initAnimation();
        }, 100);

        // Debounced resize handler
        resizeHandlerRef.current = debounce(() => {
            initAnimation();
        }, 200);
        window.addEventListener('resize', resizeHandlerRef.current);

        return () => {
            clearTimeout(timer);
            if (tlRef.current) {
                tlRef.current.progress(0).kill();
                tlRef.current = null;
            }
            if (resizeHandlerRef.current) {
                window.removeEventListener('resize', resizeHandlerRef.current);
            }
            ScrollTrigger.getAll().forEach((st) => {
                if (st.trigger === wrapRef.current) {
                    st.kill();
                }
            });
        };
    }, [initAnimation]);

    return (
        <div data-motionpath="wrap" className="motionpath-wrap z-10" ref={wrapRef}>
            <div className="motionpath-content">
                {/* <h2 className="motionpath-content-title">{title}</h2> */}
                <div className="motionpath-content-inner">
                    <div className="motionpath-content-path">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 1366 603"
                            fill="transparent"
                            preserveAspectRatio="none"
                            className="motionpath-svg"
                        >
                            <path
                                data-motionpath="path"
                                d="M1115.94 0C1297.33 38.9693 1626.89 444.65 993.816 562.057C407.372 670.816 89.0772 533.413 0 436.157"
                                stroke="transparent"
                            />
                        </svg>
                    </div>
                    <div className="motionpath-content-wrap">
                        <div className="motionpath-content-list">
                            {items.map((item, index) => (
                                <Link
                                    href={`/retreats/${item.slug}`}
                                    data-motionpath="item"
                                    className="motionpath-content-item"
                                    key={index}
                                >
                                    <div className="motionpath-content-item__visual">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="motionpath-content-item__img"
                                        />
                                    </div>
                                    <div
                                        data-motionpath="item-details"
                                        className="motionpath-content-item__details"
                                    >
                                        <span className="motionpath-content-item__label">
                                            {item.label}
                                        </span>
                                        <h3 className="motionpath-content-item__title">
                                            {item.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MotionPathGallery;
