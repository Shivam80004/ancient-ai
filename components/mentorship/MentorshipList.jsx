'use client';
import React, { useEffect, useRef } from 'react';
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

        const offset = 100; // Animation distance in %
        const duration = 0.5;
        const ease = 'power2.inOut';

        // Initial set
        gsap.set(follower, { xPercent: -50, yPercent: -50 });

        const xTo = gsap.quickTo(follower, 'x', { duration: 0.6, ease: 'power3' });
        const yTo = gsap.quickTo(follower, 'y', { duration: 0.6, ease: 'power3' });

        const onMouseMove = (e) => {
            xTo(e.clientX);
            yTo(e.clientY);
        };

        window.addEventListener('mousemove', onMouseMove);

        listItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                const forward = prevIndex === null || index > prevIndex;
                prevIndex = index;

                // Animate out existing visuals
                follower.querySelectorAll('[data-follower-visual]').forEach(el => {
                    gsap.killTweensOf(el);
                    gsap.to(el, {
                        yPercent: forward ? -offset : offset,
                        duration,
                        ease,
                        overwrite: 'auto',
                        onComplete: () => el.remove()
                    });
                });

                // Clone & insert new visual
                const visual = item.querySelector('[data-follower-visual]');
                if (!visual) return;

                const clone = visual.cloneNode(true);
                followerInner.appendChild(clone);

                if (!firstEntry) {
                    gsap.fromTo(clone,
                        { yPercent: forward ? offset : -offset },
                        { yPercent: 0, duration, ease, overwrite: 'auto' }
                    );
                } else {
                    firstEntry = false;
                }
            });

            item.addEventListener('mouseleave', () => {
                // In exact logic provided, mouseleave on item animates out the CURRENT one?
                // The provided code does:
                /*
                item.addEventListener('mouseleave', () => {
                    const el = follower.querySelector('[data-follower-visual]');
                    // ... animate out
                });
                */
                // But usually we want it to stay until we move to next, OR leave the collection.
                // The original code has explicit mouseleave logic, let's keep it but check behavior.
                // Actually the original code clears it on item leave.

                const el = follower.querySelector('[data-follower-visual]');
                if (!el) return;
                gsap.killTweensOf(el);
                gsap.to(el, {
                    yPercent: -offset,
                    duration,
                    ease,
                    overwrite: 'auto',
                    onComplete: () => el.remove()
                });
            });
        });

        const collection = wrap.querySelector('[data-follower-collection]');
        const onCollectionLeave = () => {
            follower.querySelectorAll('[data-follower-visual]').forEach(el => {
                gsap.killTweensOf(el);
                gsap.delayedCall(duration, () => el.remove());
            });
            firstEntry = true;
            prevIndex = null;
        };

        if (collection) {
            collection.addEventListener('mouseleave', onCollectionLeave);
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            if (collection) collection.removeEventListener('mouseleave', onCollectionLeave);
            // Cleanup items listeners? ideally yes but for simplicity/re-render we rely on ref
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
                            <a href={item.link || "#"} className="preview-item__inner w-inline-block">
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
                                {/* Visual for the follower */}
                                <div data-follower-visual="" className="preview-item__visual">
                                    <img src={item.thumbnail || "/images/placeholder.jpg"} alt={item.title} className="preview-item__visual-img" />
                                </div>
                            </a>
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
