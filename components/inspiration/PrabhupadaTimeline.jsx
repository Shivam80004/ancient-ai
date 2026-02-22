'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './PrabhupadaTimeline.css';

gsap.registerPlugin(ScrollTrigger);

const TIMELINE_EVENTS = [
    {
        year: '1896',
        title: 'Birth in Calcutta',
        description:
            'Abhay Charan De was born on September 1, 1896, in Calcutta. From a young age, he organized Ratha-yatra festivals and showed deep devotion to Lord Krishna.',
        image: '/prabhupada-journy/Prabhupada_Germany_Studio.jpg',
        side: 'left',
    },
    {
        year: '1922',
        title: 'Meeting His Guru',
        description:
            'At the age of 26, Abhay met his spiritual master, Srila Bhaktisiddhanta Sarasvati Thakura, who instructed him to spread the teachings of Lord Chaitanya in the English language to the Western world.',
        image: '/prabhupada-journy/Prabhupada_in_Moscow_1971.tif.jpg',
        side: 'right',
    },
    {
        year: '1965',
        title: 'Voyage on the Jaladuta',
        description:
            'At the age of 69, with just forty rupees and a trunk of books, Srila Prabhupada boarded the cargo ship Jaladuta and sailed from Calcutta to New York City — a 35-day journey across the Atlantic.',
        image: '/prabhupada-journy/MS_Jaladuta,_1961.jpg',
        side: 'left',
    },
    {
        year: '1967',
        title: 'Arrival in San Francisco',
        description:
            'Prabhupada arrived in San Francisco and ignited the Hare Krishna movement in the West. The Haight-Ashbury counter-culture embraced him, and the first public kirtans drew hundreds.',
        image: "/prabhupada-journy/Prabhupada's_arrival_in_San_Francisco_1967.jpg",
        side: 'right',
    },
    {
        year: '1970s',
        title: 'A Global Mission',
        description:
            'Srila Prabhupada circled the globe 14 times, established 108 temples, initiated over 5,000 disciples, and translated 80 volumes of Vedic literature — transforming spiritual life worldwide.',
        image: '/prabhupada-journy/500px-Prabhupada_and_the_devotees_outside_Schloss_Rettershof,_Frankfurt.jpg',
        side: 'left',
    },
];

const PrabhupadaTimeline = () => {
    const sectionRef = useRef(null);
    const pathRef = useRef(null);
    const itemRefs = useRef([]);

    useEffect(() => {
        const section = sectionRef.current;
        const path = pathRef.current;
        if (!section || !path) return;

        // Get total length of the SVG path
        const pathLength = path.getTotalLength();

        // Set initial state: path is fully hidden (stroke-dasharray trick)
        gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
        });

        // Animate the path draw on scroll
        const pathTl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 60%',
                end: 'bottom 80%',
                scrub: 1,
            },
        });

        pathTl.to(path, {
            strokeDashoffset: 0,
            ease: 'none',
        });

        // Animate each timeline item
        itemRefs.current.forEach((item, index) => {
            if (!item) return;

            const isLeft = TIMELINE_EVENTS[index].side === 'left';
            const card = item.querySelector('.timeline-card');
            const dot = item.querySelector('.timeline-dot');
            const yearEl = item.querySelector('.timeline-year');

            gsap.set(card, {
                opacity: 0,
                x: isLeft ? -80 : 80,
                y: 30,
            });
            gsap.set(dot, { scale: 0 });
            gsap.set(yearEl, { opacity: 0, y: 20 });

            const itemTl = gsap.timeline({
                scrollTrigger: {
                    trigger: item,
                    start: 'top 75%',
                    end: 'top 40%',
                    scrub: 1,
                },
            });

            itemTl
                .to(dot, { scale: 1, duration: 0.3, ease: 'back.out(2)' }, 0)
                .to(yearEl, { opacity: 1, y: 0, duration: 0.3 }, 0.1)
                .to(
                    card,
                    { opacity: 1, x: 0, y: 0, duration: 0.5, ease: 'power3.out' },
                    0.15
                );
        });

        return () => {
            ScrollTrigger.getAll().forEach((st) => {
                if (
                    st.trigger === section ||
                    itemRefs.current.some((item) => st.trigger === item)
                ) {
                    st.kill();
                }
            });
        };
    }, []);

    // Generate a clean snake / S-curve path
    // Each segment is a smooth cubic-bezier that swings to one side,
    // then the next segment swings to the opposite side.
    const generatePath = () => {
        const totalEvents = TIMELINE_EVENTS.length;
        const segmentHeight = 420; // vertical gap per event
        const amplitude = 220;     // how far left/right the curve swings
        const center = 400;        // horizontal center (viewBox 800 wide)

        // Start at top-center
        let d = `M ${center} 0`;

        for (let i = 0; i < totalEvents; i++) {
            const isLeft = TIMELINE_EVENTS[i].side === 'left';
            const targetX = isLeft ? center - amplitude : center + amplitude;
            const yStart = i * segmentHeight;
            const yEnd = yStart + segmentHeight;
            const yMid = (yStart + yEnd) / 2;

            // Smooth cubic-bezier: pull control points to the target side
            d += ` C ${center} ${yStart + segmentHeight * 0.25}, ${targetX} ${yMid - segmentHeight * 0.15}, ${targetX} ${yMid}`;
            // Curve back to center for next segment
            d += ` C ${targetX} ${yMid + segmentHeight * 0.15}, ${center} ${yEnd - segmentHeight * 0.25}, ${center} ${yEnd}`;
        }

        return d;
    };

    const svgHeight = TIMELINE_EVENTS.length * 420;

    return (
        <section ref={sectionRef} className="prabhupada-timeline">
            <div className="timeline-header">
                <span className="timeline-label">The Journey</span>
                <h2 className="timeline-title">
                    Footsteps of{' '}
                    <span className="timeline-title-highlight">Srila Prabhupada</span>
                </h2>
                <p className="timeline-subtitle">
                    From the banks of the Ganges to every corner of the globe — the
                    extraordinary mission that changed the world.
                </p>
            </div>

            <div className="timeline-container">
                {/* SVG Path */}
                <svg
                    className="timeline-svg"
                    viewBox={`0 0 800 ${svgHeight}`}
                    fill="none"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Faint background path */}
                    <path
                        d={generatePath()}
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="3"
                        fill="none"
                    />
                    {/* Animated foreground path */}
                    <path
                        ref={pathRef}
                        d={generatePath()}
                        stroke="url(#pathGradient)"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <defs>
                        <linearGradient
                            id="pathGradient"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                        >
                            <stop offset="0%" stopColor="#fc964c" />
                            <stop offset="50%" stopColor="#f62003" />
                            <stop offset="100%" stopColor="#fc964c" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Timeline items */}
                <div className="timeline-items">
                    {TIMELINE_EVENTS.map((event, index) => (
                        <div
                            key={index}
                            ref={(el) => (itemRefs.current[index] = el)}
                            className={`timeline-item timeline-item--${event.side}`}
                        >
                            {/* Center dot */}
                            <div className="timeline-dot-wrapper">
                                <div className="timeline-dot" />
                            </div>

                            {/* Year badge */}
                            <div className="timeline-year">{event.year}</div>

                            {/* Card */}
                            <div className="timeline-card">
                                <div className="timeline-card__image">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                    />
                                </div>
                                <div className="timeline-card__content" data-year={event.year}>
                                    <h3 className="timeline-card__title">
                                        {event.title}
                                    </h3>
                                    <p className="timeline-card__description">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PrabhupadaTimeline;
