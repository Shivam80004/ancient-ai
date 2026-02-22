'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import './preview-follower.css';

const MentorshipList = ({ items }) => {
    const wrapRef = useRef(null);
    const followerRef = useRef(null);
    const cursorInnerRef = useRef(null);

    useEffect(() => {
        if (!wrapRef.current) return;

        const wrap = wrapRef.current;
        const follower = followerRef.current;
        const followerInner = cursorInnerRef.current;
        const listItems = wrap.querySelectorAll('[data-follower-item]');

        let prevIndex = null;
        let firstEntry = true;
        // Tracks whether the mouse has moved at least once over this page.
        // Prevents the jarring snap from off-screen → cursor on first move.
        let hasMovedOnce = false;

        const offset = 100; // Animation distance in percent
        const duration = 0.5;
        const ease = 'power2.inOut';

        // Park the follower far off-screen so it doesn't flash at (0, 0) before
        // the first mousemove fires. xPercent/yPercent keep the centering offset.
        gsap.set(follower, { xPercent: -50, yPercent: -50, x: -9999, y: -9999 });

        // Tighter duration (0.4s) for a snappier feel that doesn't look "frozen"
        const xTo = gsap.quickTo(follower, 'x', { duration: 0.4, ease: 'power3' });
        const yTo = gsap.quickTo(follower, 'y', { duration: 0.4, ease: 'power3' });

        // rAF gate – avoids hammering quickTo on every mousemove during scroll
        let rafPending = false;
        let latestX = 0;
        let latestY = 0;

        const onMouseMove = (e) => {
            latestX = e.clientX;
            latestY = e.clientY;

            // On the very first move: teleport instantly so there's no
            // 0.4-second slow-pan from (-9999, -9999) to the cursor.
            if (!hasMovedOnce) {
                hasMovedOnce = true;
                gsap.set(follower, { x: latestX, y: latestY });
                return;
            }

            if (!rafPending) {
                rafPending = true;
                requestAnimationFrame(() => {
                    xTo(latestX);
                    yTo(latestY);
                    rafPending = false;
                });
            }
        };

        window.addEventListener('mousemove', onMouseMove);

        // ── Item hover handlers ─────────────────────────────────────────────
        // Store references so they can be removed on cleanup.
        const itemHandlers = [];

        listItems.forEach((item, index) => {
            const onEnter = () => {
                const forward = prevIndex === null || index > prevIndex;
                prevIndex = index;

                // Animate out any existing visuals
                follower.querySelectorAll('[data-follower-visual]').forEach((el) => {
                    gsap.killTweensOf(el);
                    gsap.to(el, {
                        yPercent: forward ? -offset : offset,
                        duration,
                        ease,
                        overwrite: 'auto',
                        onComplete: () => el.remove(),
                    });
                });

                // Clone the item's visual and inject into the follower
                const visual = item.querySelector('[data-follower-visual]');
                if (!visual) return;

                const clone = visual.cloneNode(true);
                followerInner.appendChild(clone);

                if (!firstEntry) {
                    gsap.fromTo(
                        clone,
                        { yPercent: forward ? offset : -offset },
                        { yPercent: 0, duration, ease, overwrite: 'auto' }
                    );
                } else {
                    firstEntry = false;
                }
            };

            const onLeave = () => {
                const el = follower.querySelector('[data-follower-visual]');
                if (!el) return;
                gsap.killTweensOf(el);
                gsap.to(el, {
                    yPercent: -offset,
                    duration,
                    ease,
                    overwrite: 'auto',
                    onComplete: () => el.remove(),
                });
            };

            item.addEventListener('mouseenter', onEnter);
            item.addEventListener('mouseleave', onLeave);
            itemHandlers.push({ item, enter: onEnter, leave: onLeave });
        });

        // ── Collection leave ────────────────────────────────────────────────
        const collection = wrap.querySelector('[data-follower-collection]');

        const onCollectionLeave = () => {
            follower.querySelectorAll('[data-follower-visual]').forEach((el) => {
                gsap.killTweensOf(el);
                gsap.delayedCall(duration, () => el.remove());
            });
            firstEntry = true;
            prevIndex = null;
        };

        if (collection) {
            collection.addEventListener('mouseleave', onCollectionLeave);
        }

        // ── Cleanup ─────────────────────────────────────────────────────────
        return () => {
            window.removeEventListener('mousemove', onMouseMove);

            if (collection) {
                collection.removeEventListener('mouseleave', onCollectionLeave);
            }

            itemHandlers.forEach(({ item, enter, leave }) => {
                item.removeEventListener('mouseenter', enter);
                item.removeEventListener('mouseleave', leave);
            });

            // Kill any lingering tweens on the follower itself
            gsap.killTweensOf(follower);
        };
    }, [items]);

    return (
        <div ref={wrapRef} data-follower-wrap="" className="preview-container text-white py-20 relative z-10">
            {/* Header Row */}
            <div className="preview-item__row tablet--hide mb-8 border-white/20 pb-4">
                <div className="preview-item__col is--large"><span className="preview-container__label">Program</span></div>
                <div className="preview-item__col is--small"><span className="preview-container__label">Focus</span></div>
                <div className="preview-item__col is--small"><span className="preview-container__label">Year</span></div>
                <div className="preview-item__col is--medium"><span className="preview-container__label">Type</span></div>
            </div>

            <div data-follower-collection="" className="preview-collection">
                <div className="preview-list">
                    {items.map((item, i) => (
                        <div key={i} data-follower-item="" className="preview-item group">
                            <Link href={item.link || "#"} className="preview-item__inner w-inline-block">
                                <div className="preview-item__row">
                                    <div className="preview-item__col is--large">
                                        <h2 className="preview-item__heading font-light tracking-tight group-hover:text-orange-500 transition-colors duration-300">
                                            {item.title}
                                        </h2>
                                    </div>
                                    <div className="preview-item__col is--small tablet--hide">
                                        <p className="preview-item__text">{item.category}</p>
                                    </div>
                                    <div className="preview-item__col is--small">
                                        <p className="preview-item__text">2025</p>
                                    </div>
                                    <div className="preview-item__col is--medium">
                                        <p className="preview-item__text">Mentorship</p>
                                    </div>
                                </div>
                                {/* Visual for the follower — hidden from normal flow */}
                                <div data-follower-visual="" className="preview-item__visual">
                                    <img
                                        src={item.thumbnail || "/images/placeholder.jpg"}
                                        alt={item.title}
                                        className="preview-item__visual-img"
                                    />
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cursor Follower */}
            <div ref={followerRef} data-follower-cursor="" className="preview-follower h-[30vh]">
                <div ref={cursorInnerRef} data-follower-cursor-inner="" className="preview-follower__inner">
                    <div className="preview-follower__label">
                        <div className="preview-follower__label-span">View Program</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorshipList;
