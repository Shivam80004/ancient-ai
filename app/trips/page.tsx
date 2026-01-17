import React from 'react';
import PageHero from '@/components/ui/PageHero';
import Card from '@/components/ui/Card';

const TRIPS = [
    {
        title: "Virtual Voyage to Vrindavan",
        description: "Experience the holy dhama from the comfort of your home. A guided visual journey.",
        category: "Virtual Experience"
    },
    {
        title: "Mayapur Pilgrimage",
        description: "Join us for an immersive retreat in the spiritual capital of the world.",
        category: "Retreat"
    },
    {
        title: "Himalayan Treks",
        description: "Walking in the footsteps of sages. Meditation and trekking combined.",
        category: "Adventure"
    }
];

export default function TripsPage() {
    return (
        <main className="bg-black min-h-screen">
            <PageHero
                title="Spiritual Journeys"
                subtitle="Travel not just to see new places, but to find a new self."
                image="/images/hero-trips.jpg"
            />

            <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {TRIPS.map((item, index) => (
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
