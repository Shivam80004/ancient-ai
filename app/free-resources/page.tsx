'use client';
import React, { useRef } from 'react';
import PageHero from '@/components/ui/PageHero';
import ResourceCard from '@/components/resources/ResourceCard';

const RESOURCES = [
    {
        title: "Gita Cheat Sheet",
        description: "Quick reference guide to the key verses and concepts of the Bhagavad Gita. Perfect for daily inspiration.",
        category: "PDF Download",
        image: "/gellery-img/gallery-img-5.png",
        type: "pdf",
        className: "md:col-span-2 md:row-span-2"
    },
    {
        title: "Kirtan Playlist",
        description: "Curated selection of soul-stirring kirtans to uplift your consciousness.",
        category: "Audio",
        image: "/gellery-img/gallery-img-3.jpg",
        type: "audio",
        className: "md:col-span-1 md:row-span-1"
    },
    {
        title: "Introduction to Vedanta eBook",
        description: "A comprehensive starter guide to Vedic philosophy.",
        category: "eBook",
        image: "/images/1-gita.png",
        type: "ebook",
        className: "md:col-span-1 md:row-span-1"
    },
    {
        title: "Meditation Timer & Guide",
        description: "Tools to help you start your daily meditation practice with guided sessions and ambient sounds.",
        category: "Tool",
        image: "/gellery-img/gallery-img-8.png",
        type: "tool",
        className: "md:col-span-1 md:row-span-1"
    },
    {
        title: "Ayurveda Basics Workshop",
        description: "Learn the fundamentals of Ayurveda for balanced living and holistic health.",
        category: "Video Course",
        image: "/gellery-img/gallery-img-2.webp",
        type: "video",
        className: "md:col-span-1 md:row-span-1"
    },
    {
        title: "Sanskrit Pronunciation Guide",
        description: "Master the sounds of the sacred language with this easy-to-follow audio guide.",
        category: "Audio/PDF",
        image: "/gellery-img/gallery-img-6.png",
        type: "audio",
        className: "md:col-span-2 md:row-span-1"
    }
];

export default function FreeResourcesPage() {
    const sectionRef = useRef<HTMLDivElement>(null);

    return (
        <main className="bg-linear-to-tl from-zinc-900 via-black to-zinc-900 min-h-screen relative overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/20 rounded-full mix-blend-screen filter blur-[120px]" />
            </div>

            <div className="relative z-10">
                <PageHero
                    title="Free Resources"
                    subtitle="Knowledge should be free. Access these tools to jumpstart your spiritual journey."
                    image="/gellery-img/gallery-img-8.png"
                />

                <section ref={sectionRef} className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(250px,auto)]">
                        {RESOURCES.map((item, index) => (
                            <div key={index} className={item.className}>
                                <ResourceCard
                                    index={index}
                                    title={item.title}
                                    description={item.description}
                                    category={item.category}
                                    image={item.image}
                                    type={item.type as any}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
