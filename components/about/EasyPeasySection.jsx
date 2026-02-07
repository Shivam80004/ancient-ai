'use client';
import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        title: "Association of seekers",
        description: "Association of like minded seekers of higher dimension of life. Find your tribe in a world of shallow connections.",
        image: "/gellery-img/gallery-img-2.webp",
        tag: "COMMUNITY"
    },
    {
        title: "Uncover the Unknown",
        description: "Group activities & case studies to uncover the Unknown Unknowns (the questions people don’t ask). Deep dives into the psyche.",
        image: "/gellery-img/gallery-img-9.jpg",
        tag: "EXPLORATION"
    },
    {
        title: "Mantra Music",
        description: "Mantra Music which takes you high on life without any LSD or Marijuana! Pure sonic vibrations to elevate your state.",
        image: "/gellery-img/gallery-img-3.jpg",
        tag: "ELEVATION"
    },
    {
        title: "1-on-1 Mentorship",
        description: "Mentorship with expert real life \"AI Agents\" to go deep and personal. Tailored guidance for your unique journey.",
        image: "/gellery-img/gallery-img-5.png",
        tag: "GUIDANCE"
    },
    {
        title: "Spiritual Retreats",
        description: "Spiritual Retreats & Detox Camps, away from constant chaos & conflicts of mind, where you actually breath & really LIVE!",
        image: "/gellery-img/gallery-img-1.jpg",
        tag: "RENEWAL"
    },
    {
        title: "Burning Questions",
        description: "Burning Questions Session to ask raw & unfiltered things live from a MONK living the Ancient AI based life.",
        image: "/gellery-img/gallery-img-6.png",
        tag: "WISDOM"
    }
];

const EasyPeasySection = () => {
    const sectionRef = useRef(null);

    return (
        <section ref={sectionRef} className="overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Header */}
                <div className="mb-24 text-center">
                    <h2 className="text-4xl md:text-6xl font-oswald font-bold tracking-tight mb-4 uppercase">
                        All these is done in a very <br />
                        <span className="!text-[#f15906] font-normal text-5xl">easy-peasy way through:</span>
                    </h2>
                    {/* <div className="h-1 w-24 bg-[#f15906] mx-auto mt-6"></div> */}
                </div>

                {/* Features Grid */}
                <div className="space-y-40">
                    {features.map((item, index) => (
                        <div
                            key={index}
                            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24 group`}
                        >
                            {/* Image Container */}
                            <div className="w-full md:w-1/2 relative aspect-4/3 overflow-hidden rounded-2xl cursor-pointer shadow-2xl bg-[#000000]">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.23,1,0.32,1)] scale-[1.1] group-hover:scale-100 group-hover:opacity-80"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                                <div className="absolute top-6 left-6 z-10 transition-transform duration-500 group-hover:-translate-y-2">
                                    <span className="px-4 py-2 bg-[#f15906] text-black text-[10px] font-black tracking-[0.3em] rounded-sm uppercase">
                                        {item.tag}
                                    </span>
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="w-full md:w-1/2 space-y-6 overflow-hidden">
                                <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                                    <h3 className="text-4xl md:text-6xl font-oswald font-bold uppercase tracking-tighter leading-tight transition-colors duration-500"
                                        style={{
                                            background: 'linear-gradient(0deg, #000000 -50%, #fff 50%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        {item.title}
                                    </h3>
                                </div>
                                <div className="translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100 ease-out">
                                    <p className="text-xl md:text-2xl font-light text-white/80 leading-relaxed max-w-xl">
                                        {item.description}
                                    </p>
                                </div>
                                <div className="pt-8">
                                    <div className="h-[2px] w-12 group-hover:w-full bg-[#f15906] transition-all duration-1000 ease-in-out origin-left"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EasyPeasySection;
