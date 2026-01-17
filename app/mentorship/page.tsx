import React from 'react';
import PageHero from '@/components/ui/PageHero';
import MentorshipList from '@/components/mentorship/MentorshipList';
import MentorshipCTA from '@/components/mentorship/MentorshipCTA';

const MENTORSHIPS = [
    {
        title: "1% Gita",
        description: "Break free from the chains of habit. A guided program to reclaim your freedom.",
        category: "Reform",
        thumbnail: "/images/1-gita.png"
    },
    {
        title: "Early Riser",
        description: "The Art & Science of Rising Early. Master your mornings, master your life.",
        category: "Discipline",
        thumbnail: "/gellery-img/gallery-img-5.png"
    },
    {
        title: "Science of Celibacy",
        description: "Vedic wisdom on Brahmacarya. Harnessing vital energy for higher purpose.",
        category: "Lifestyle",
        thumbnail: "/gellery-img/gallery-img-2.webp"
    },
    {
        title: "Mind, Body & Soul Detox",
        description: "A complete system reset. Purify your existence on all levels.",
        category: "Wellness",
        thumbnail: "/gellery-img/gallery-img-3.jpg"
    },
    {
        title: "Art of Parenting",
        description: "Raising conscious children in a distracted world. Vedic secrets for modern parents.",
        category: "Family",
        thumbnail: "/gellery-img/gallery-img-4.jpg"
    },
    {
        title: "The Higher Taste",
        description: "Relishing Life Beyond Mind & Matter. Finding satisfaction that lasts.",
        category: "Spirituality",
        thumbnail: "/gellery-img/gallery-img-6.png"
    },
    {
        title: "Mantra Meditation",
        description: "Yoga for Mind & Soul. Connect with the divine through sound.",
        category: "Meditation",
        thumbnail: "/gellery-img/gallery-img-7.png"
    },
    {
        title: "Tattva: Seeing Inside Out",
        description: "Developing spiritual vision to see the reality behind the illusion.",
        category: "Philosophy",
        thumbnail: "/gellery-img/gallery-img-8.png"
    },
    {
        title: "Loving Life, Embracing Death!",
        description: "Overcoming the ultimate fear. Living fully by understanding the end.",
        category: "Existential",
        thumbnail: "/gellery-img/gallery-img-9.jpg"
    }
];

export default function MentorshipPage() {
    return (
        <main className="bg-black min-h-screen">
            <PageHero
                title="Mentorship Programs"
                subtitle="Personalized guidance from experienced mentors to help you navigate life's toughest challenges."
                image="/gellery-img/gallery-img-2.webp"
            />

            <section className="py-20 px-4 md:px-8 max-w-[100vw] mx-auto overflow-hidden">
                <MentorshipList items={MENTORSHIPS} />
            </section>

            <MentorshipCTA />
        </main>
    );
}
