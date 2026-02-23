'use client';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TEAM_MEMBERS = [
    {
        name: "Anuttam Hari Das",
        role: "Co-Founder and Chief Monk Officer (CMO)",
        desc: "Works on the hardest problem of all — the human mind",
        image: "/images/team-1.png"
    },
    {
        name: "Roshan Saw",
        role: "Co-Founder and COO",
        desc: "Turns depth into form — without diluting meaning.",
        image: "/images/team-3.png"
    },
    {
        name: "Shivam Gupta",
        role: "Co-Founder and CTO",
        desc: "Designs digital spaces that slow you down.",
        image: "/images/team-2.png"
    }
];

const CUSTOM_GRADIENT = 'linear-gradient(261.26deg, rgba(246, 32, 3, 0) -11.86%, rgb(246, 32, 3) 30.99%, rgb(246, 32, 3) 101.39%, rgb(253, 124, 52) 103.82%)';

const TeamCard = ({ member, index }) => {
    const cardRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(contentRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: "top 60%", // Triggers when top of card hits 60% of viewport height
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }, cardRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={cardRef} className="h-[85vh] md:w-[35vw] w-full mx-auto flex items-center justify-center p-6 sticky top-0 bg-black/50 backdrop-blur-sm border-t border-white/10 lg:static lg:bg-transparent lg:border-none">
            <div className="relative h-full w-full overflow-hidden rounded-2xl group">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover opacity-90 transition-opacity duration-700 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div ref={contentRef} className="absolute inset-0 flex text-center flex-col justify-end p-8 md:p-12 z-10">
                    <div className="space-y-2">

                        <div>
                            <h3 className="text-4xl md:text-3xl font-semibold text-white tracking-tight">
                                {member.name}
                            </h3>

                            <div className="space-y-1">
                                <p className="text-xl md:text-lg font-light text-white/90">
                                    {member.role}
                                </p>
                                {/* {member.subRole && (
                                    <p className="text-base text-white/50 font-light">
                                        {member.subRole}
                                    </p>
                                )} */}
                            </div>
                        </div>

                        <p className="text-sm text-white/70 leading-relaxed font-light pt-1 border-t border-white/10">
                            {member.desc}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OurTeam = () => {
    const containerRef = useRef(null);
    const leftColRef = useRef(null);

    return (
        <section ref={containerRef} className="relative bg-black text-white w-full mt-14">
            <div className="flex flex-col lg:flex-row">

                {/* Sticky Left Column */}
                <div className="w-full lg:w-1/2 h-auto lg:h-screen lg:sticky lg:top-0 flex flex-col justify-center px-8 md:px-16 py-20 lg:py-0 border-r border-white/5 z-20 bg-black">
                    <div className="space-y-10 max-w-xl">
                        <div>
                            <span className="text-sm font-semibold tracking-[0.3em] uppercase text-orange-500 mb-6 block">
                                Our Team
                            </span>
                            <div className="flex flex-col">
                                <span className="text-5xl md:text-7xl font-light text-white leading-[1.1]">
                                    Meet the
                                </span>
                                <span className="text-5xl md:text-7xl font-semibold text-white leading-[1.1]">
                                    AI Agents!
                                </span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <p className="text-xl md:text-2xl font-light leading-relaxed text-white/80">
                                People working on the oldest problem using modern tools.
                            </p>
                            <p className="text-lg text-white/60 border-l-2 border-orange-500/50 pl-6">
                                Ancient AI is built by people living & breathing this ancient wisdom day and night.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Right Column */}
                <div className="w-full lg:w-1/2 z-10">
                    <div className="flex flex-col gap-10 mt-[20vh]">
                        {TEAM_MEMBERS.map((member, index) => (
                            <TeamCard key={index} member={member} index={index} />
                        ))}
                    </div>

                    {/* Footer Section for Team List */}
                    <div className="h-[20vh] flex items-center justify-center md:p-2 p-5 text-center bg-zinc-950"
                        style={{
                            background: "linear-gradient(90deg, transparent, rgba(255, 123, 0, 0.3), transparent)"
                        }}
                    >
                        <div className="h-full w-full max-w-lg flex flex-col justify-center">
                            <h3 className="text-xl md:text-4xl font-semibold text-white/90">
                                No Gurus, No Influencers!
                            </h3>
                            <p className="text- md:text-xl text-white font-light tracking-tight">
                                Just people doing the work for a higher mission.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default OurTeam;
