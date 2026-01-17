import React from 'react';
import PageHero from '@/components/ui/PageHero';
import Card from '@/components/ui/Card';

const COURSES = [
    {
        title: "Fan the Spark",
        description: "Ignite the dormant potential within. A foundational course on spiritual awakening.",
        category: "Introductory"
    },
    {
        title: "GYM Unplugged",
        description: "Disconnect to Reconnect. Unplug from the noise and tune into the frequency of the soul.",
        category: "Lifestyle"
    },
    {
        title: "GYM Decoded",
        description: "Deciphering the ancient codes of the Gita for practical modern application.",
        category: "Philosophy"
    },
    {
        title: "Soulful GYM Workshop",
        description: "Intensive weekend workshops designed to break barriers and build spiritual muscle.",
        category: "Workshop"
    },
    {
        title: "GYMx",
        description: "Gita for Young Minds Xplored. Advanced tracks for serious seekers.",
        category: "Advanced"
    },
    {
        title: "Transcendental GYM",
        description: "Go beyond the physical and mental. Work out your eternal self.",
        category: "Meditation"
    },
    {
        title: "GYM Reloaded",
        description: "Revisiting core concepts with fresh perspectives and deeper insights.",
        category: "Refresher"
    },
    {
        title: "Ancient GYM",
        description: "Traditional approaches to Gita study, preserved in their authentic form.",
        category: "Traditional"
    },
    {
        title: "Vedic GYM",
        description: "Comprehensive Vedic wisdom applied to holistic well-being.",
        category: "Holistic"
    }
];

export default function CoursesPage() {
    return (
        <main className="bg-black min-h-screen">
            <PageHero
                title="Academy Courses"
                subtitle="Transformative wisdom for every stage of your journey. Strengthening the mind, body, and soul."
                image="/gellery-img/gallery-img-4.jpeg"
            />

            <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {COURSES.map((course, index) => (
                        <Card
                            key={index}
                            title={course.title}
                            description={course.description}
                            category={course.category}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
