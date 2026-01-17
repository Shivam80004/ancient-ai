import React from 'react';
import PageHero from '@/components/ui/PageHero';
import Card from '@/components/ui/Card';

const RESOURCES = [
    {
        title: "Gita Cheat Sheet",
        description: "Quick reference guide to the key verses and concepts of the Bhagavad Gita.",
        category: "PDF Download"
    },
    {
        title: "Kirtan Playlist",
        description: "Curated selection of soul-stirring kirtans to uplift your consciousness.",
        category: "Audio"
    },
    {
        title: "Introduction to Vedanta eBook",
        description: "A comprehensive starter guide to Vedic philosophy.",
        category: "eBook"
    },
    {
        title: "Meditation Timer & Guide",
        description: "Tools to help you start your daily meditation practice.",
        category: "Tool"
    }
];

export default function FreeResourcesPage() {
    return (
        <main className="bg-black min-h-screen">
            <PageHero
                title="Free Resources"
                subtitle="Knowledge should be free. Access these tools to jumpstart your spiritual journey."
                image="/images/hero-resources.jpg"
            />

            <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {RESOURCES.map((item, index) => (
                        <Card
                            key={index}
                            title={item.title}
                            description={item.description}
                            category={item.category}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
