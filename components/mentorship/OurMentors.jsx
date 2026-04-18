'use client';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MENTORS = [
    {
        name: "Ashesh Govind Dasa",
        role: "Chief Monk Mentor",
        desc: "Guide through ancient Vedic wisdom",
        image: "/images/mentors/mentor-1.png",
        link: "https://taponn.me/AsheshAAI",
    },
    {
        name: "Shubham Mahawar",
        role: "Chief Mentor",
        desc: "Learns from the best and teaches the best",
        image: "/images/mentors/mentor-2.jpeg",
        link: "https://taponn.me/ShubhamAAI",
    },
    // {
    //     name: "Gourav Gupta",
    //     role: "Chief Mentor",
    //     desc: "Experienced in ancient Vedic wisdom",
    //     image: "/images/mentors/mentor-3.jpeg",
    //     link: "https://taponn.me/GauravAAI",
    // },
    {
        name: "Mukunda Javanjal",
        role: "Chief Mentor",
        desc: "Highly experienced in ancient Vedic wisdom",
        image: "/images/mentors/mentor-4.jpeg",
        link: "https://taponn.me/MukundAAI",
    },
    {
        name: "Ujjwal V Chavan",
        role: "Chief Mentor",
        desc: "Highly experienced in ancient Vedic wisdom",
        image: "/images/mentors/mentor-5.jpeg",
        link: "https://taponn.me/UjjwalAAI",
    },
    {
        name: "Vedant Zodgekar",
        role: "Chief Mentor",
        desc: "Highly experienced in Vedic wisdom",
        image: "/images/mentors/mentor-6.jpeg",
        link: "https://taponn.me/VedantAAI",
    },
];

const MentorCard = ({ mentor, index }) => {
    const cardRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                contentRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    delay: index * 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        }, cardRef);

        return () => ctx.revert();
    }, [index]);

    return (
        <div ref={cardRef} className="h-[70vh] w-full flex items-center justify-center">
            <a
                href={mentor.link}
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-full w-full overflow-hidden rounded-2xl group block cursor-pointer"
                aria-label={`View ${mentor.name}'s profile`}
            >
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={mentor.image}
                        alt={mentor.name}
                        fill
                        className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div
                    ref={contentRef}
                    className="absolute inset-0 flex text-center flex-col justify-end md:p-8 p-4 z-10"
                >
                    <div className="space-y-2">
                        <div>
                            <h3 className="text-3xl md:text-2xl font-semibold text-white tracking-tight">
                                {mentor.name}
                            </h3>
                            <div className="space-y-1">
                                <p className="text-lg md:text-base font-light text-white/90">
                                    {mentor.role}
                                </p>
                            </div>
                        </div>
                        {/* <p className="text-sm text-white/70 leading-relaxed font-light pt-1 border-t border-white/10">
                            {mentor.desc}
                        </p> */}

                        {/* View Profile CTA */}
                        <div className="pt-3 flex items-center justify-center gap-2 opacity-100 md:opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                            <span className="text-sm font-semibold tracking-widest uppercase bg-gradient-to-b from-accent-warm to-accent-warm/60 px-2 py-2 rounded-lg text-white">
                                Connect Mentor
                            </span>
                            {/* <span className="text-orange-400 text-sm">→</span> */}
                        </div>
                    </div>
                </div>
            </a>
        </div>
    );
};

const OurMentors = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                headingRef.current,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: headingRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative bg-black text-white py-24 px-4 md:px-8 lg:px-16 w-full">
            {/* Section Header */}
            <div ref={headingRef} className="mb-16">
                <div className="flex gap-1 items-center justify-center">
                    <span className="text-5xl md:text-6xl font-light text-white leading-[1.1]">
                        Our
                    </span>
                    <span className="text-5xl md:text-6xl font-semibold text-white pl-2 leading-[1.1]">
                        Mentors
                    </span>
                </div>

                <p className="mt-1 text-lg md:text-xl text-white/60 font-light text-center leading-relaxed">
                    People living and breathing ancient wisdom every single day — here to guide you through yours.
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {MENTORS.map((mentor, index) => (
                    <MentorCard key={index} mentor={mentor} index={index} />
                ))}
            </div>
        </section>
    );
};

export default OurMentors;
