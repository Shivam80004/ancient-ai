'use client';
import React from 'react';
import CoursesCarousel from '@/components/courses/CoursesCarousel';
import PageHero from '@/components/ui/PageHero';
import CallToAction from '@/components/home/CallToAction';
import { COURSES } from '@/lib/course-data';

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
