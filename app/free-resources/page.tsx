'use client';
import React, { useRef } from 'react';
import PageHero from '@/components/ui/PageHero';
import ResourceCard from '@/components/resources/ResourceCard';

const RESOURCES = [
    {
        title: "Gita Cheat Sheet",
        description: "A crisp, visual reference to the Bhagavad Gita's most powerful verses — distilled so you can carry the wisdom anywhere.",
        category: "PDF Download",
        image: "/gellery-img/gallery-img-5.png",
        type: "pdf",
        link: "#",
        className: "md:col-span-2 md:row-span-1"
    },
    {
        title: "Kirtan Playlist",
        description: "Carefully curated soul-stirring kirtans from HKM Mumbai — perfect for meditation, morning sadhana, or anytime you need to reset.",
        category: "Audio",
        image: "/gellery-img/gallery-img-3.jpg",
        type: "audio",
        link: "https://www.youtube.com/@HKMMumbai",
        className: "md:col-span-2 md:row-span-1"
    },
    {
        title: "Bhagavad Gita PDF",
        description: "The complete Bhagavad Gita As It Is by Srila Prabhupada — free to read, study, and share. The most translated spiritual text in history.",
        category: "PDF Download",
        image: "/images/1-gita.png",
        type: "pdf",
        link: "https://www.vedabase.com/en/bg",
        className: "md:col-span-2 md:row-span-1"
    },
    {
        title: "Mini Documentary Series",
        description: "Short, impactful films on Vedic philosophy, monk life, and spiritual transformation — produced by HKM Mumbai.",
        category: "Video Series",
        image: "/gellery-img/gallery-img-2.webp",
        type: "video",
        link: "https://www.youtube.com/@HKMMumbai",
        className: "md:col-span-2 md:row-span-1"
    },
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
                                    link={item.link}
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
