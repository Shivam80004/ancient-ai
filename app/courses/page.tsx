'use client';
import React from 'react';
import CoursesCarousel from '@/components/courses/CoursesCarousel';
import PageHero from '@/components/ui/PageHero';
import CallToAction from '@/components/home/CallToAction';

const COURSES = [
    {
        title: "Fan the Spark",
        description: "Ignite the dormant potential within. A foundational course on spiritual awakening.",
        category: "Introductory",
        image: "/gellery-img/gallery-img-1.jpg",
        slug: "fan-the-spark"
    },
    {
        title: "GYM Unplugged",
        description: "Disconnect to Reconnect. Unplug from the noise and tune into the frequency of the soul.",
        category: "Lifestyle",
        image: "/gellery-img/gallery-img-2.webp",
        slug: "gym-unplugged"
    },
    {
        title: "GYM Decoded",
        description: "Deciphering the ancient codes of the Gita for practical modern application.",
        category: "Philosophy",
        image: "/gellery-img/gallery-img-3.jpg",
        slug: "gym-decoded"
    },
    {
        title: "Soulful GYM Workshop",
        description: "Intensive weekend workshops designed to break barriers and build spiritual muscle.",
        category: "Workshop",
        image: "/gellery-img/gallery-img-4.jpeg",
        slug: "soulful-gym-workshop"
    },
    {
        title: "GYMx",
        description: "Gita for Young Minds Xplored. Advanced tracks for serious seekers.",
        category: "Advanced",
        image: "/gellery-img/gallery-img-5.png",
        slug: "gymx"
    },
    {
        title: "Transcendental GYM",
        description: "Go beyond the physical and mental. Work out your eternal self.",
        category: "Meditation",
        image: "/gellery-img/gallery-img-6.png",
        slug: "transcendental-gym"
    },
    {
        title: "GYM Reloaded",
        description: "Revisiting core concepts with fresh perspectives and deeper insights.",
        category: "Refresher",
        image: "/gellery-img/gallery-img-7.png",
        slug: "gym-reloaded"
    },
    {
        title: "Ancient GYM",
        description: "Traditional approaches to Gita study, preserved in their authentic form.",
        category: "Traditional",
        image: "/gellery-img/gallery-img-8.png",
        slug: "ancient-gym"
    },
    {
        title: "Vedic GYM",
        description: "Comprehensive Vedic wisdom applied to holistic well-being.",
        category: "Holistic",
        image: "/gellery-img/gallery-img-9.jpg",
        slug: "vedic-gym"
    }
];

export default function CoursesPage() {
    return (
        <main className="bg-black min-h-screen overflow-hidden">

            <PageHero
                title="Academy Courses"
                subtitle="Transformative wisdom for every stage of your journey. Strengthening the mind, body, and soul."
                image="/gellery-img/gallery-img-4.jpeg"
            />

            <CoursesCarousel courses={COURSES} />

            <CallToAction />

            <style jsx global>{`
                /* Global styles for 3D transform */
                .perspective-3000 {
                    perspective: 3000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
            `}</style>
        </main>
    );
}
