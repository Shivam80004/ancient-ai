import React from 'react';
import PageHero from '@/components/ui/PageHero';
import MentorshipList from '@/components/mentorship/MentorshipList';
import MentorshipCTA from '@/components/mentorship/MentorshipCTA';
import OurMentors from '@/components/mentorship/OurMentors';
import { MENTORSHIPS } from '@/lib/mentorship-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Events & Mentorship',
    description: "Personalized guidance from experienced mentors to help you navigate life's toughest challenges.",
    alternates: {
        canonical: '/events-and-mentorship',
    }
};

export default function MentorshipPage() {
    return (
        <main className="bg-black min-h-screen">
            <PageHero
                title="Events & Mentorship"
                subtitle="Personalized guidance from experienced mentors to help you navigate life's toughest challenges."
                image="/gellery-img/gallery-img-2.webp"
            />

            <section className="py-20 px-4 md:px-8 max-w-[100vw] mx-auto overflow-hidden">
                <MentorshipList items={MENTORSHIPS} />
            </section>

            <OurMentors />

            <MentorshipCTA />
        </main>
    );
}
