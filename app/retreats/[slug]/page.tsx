'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import RevealText from '@/components/animation/RevealText';

const TRIPS_DATA: Record<string, {
    title: string;
    label: string;
    image: string;
    description: string;
    highlights: string[];
    duration: string;
    groupSize: string;
}> = {
    'vrindavan-yatra': {
        title: 'Vrindavan Yatra',
        label: 'Experience 001',
        image: '/gellery-img/gallery-img-1.jpg',
        description: 'Walk through the sacred land where Lord Krishna performed His divine pastimes. This immersive yatra takes you through the twelve forests of Vrindavan, visiting ancient temples and experiencing the living culture of devotion that has thrived here for millennia.',
        highlights: [
            'Visit the seven major temples of Vrindavan',
            'Parikrama of Govardhan Hill',
            'Early morning mangal aarti at Banke Bihari Temple',
            'Boat ride on the sacred Yamuna river',
            'Guided meditation sessions at key spiritual sites',
        ],
        duration: '7 Days / 6 Nights',
        groupSize: '15-25 participants',
    },
    'mayapur-retreat': {
        title: 'Mayapur Retreat',
        label: 'Experience 002',
        image: '/gellery-img/gallery-img-2.webp',
        description: 'Join us for an immersive retreat in the spiritual capital of the world. Experience the grandeur of the Temple of the Vedic Planetarium. Absorb yourself in kirtans, classes, and the serene atmosphere of Mayapur Dham along the banks of the Ganges.',
        highlights: [
            'Guided tour of the Temple of Vedic Planetarium',
            'Daily kirtan and bhajan sessions',
            'Visit to Yogapitha — the birthplace of Lord Chaitanya',
            'Navadvipa Dham Parikrama',
            'Cooking class — authentic Bengali prasadam',
        ],
        duration: '5 Days / 4 Nights',
        groupSize: '20-30 participants',
    },
    'himalayan-trek': {
        title: 'Himalayan Trek',
        label: 'Experience 003',
        image: '/gellery-img/gallery-img-3.jpg',
        description: 'Walking in the footsteps of sages. Combine meditation and trekking through the pristine Himalayan trails. From Rishikesh to Badrinath, this journey blends physical adventure with deep spiritual practice in the abode of the Devas.',
        highlights: [
            'Trek through Hemkund Sahib trail',
            'Meditation at sunrise in the Valley of Flowers',
            'Visit Badrinath Temple and hot springs',
            'Evening Ganga aarti in Rishikesh',
            'Yoga sessions with experienced practitioners',
        ],
        duration: '10 Days / 9 Nights',
        groupSize: '10-15 participants',
    },
    'govardhan-parikrama': {
        title: 'Govardhan Parikrama',
        label: 'Experience 004',
        image: '/gellery-img/gallery-img-4.jpeg',
        description: 'Circumambulate the sacred Govardhan Hill, the hill that Lord Krishna lifted with His little finger. This parikrama is a deeply meditative experience, walking barefoot on the ancient path while hearing the pastimes associated with every kunda and temple along the way.',
        highlights: [
            'Complete 21km barefoot parikrama',
            'Visit Radha Kunda and Shyama Kunda',
            'Darshan at Daan Ghati Temple',
            'Stories and pastimes narrated by experienced guides',
            'Prasadam at historic temples along the route',
        ],
        duration: '3 Days / 2 Nights',
        groupSize: '20-40 participants',
    },
    'sacred-ganga-aarti': {
        title: 'Sacred Ganga Aarti',
        label: 'Experience 005',
        image: '/gellery-img/gallery-img-5.png',
        description: 'Witness the magnificent Ganga Aarti ceremony at the ghats of Varanasi. This experience takes you through the ancient city of Kashi, exploring its timeless temples, narrow lanes, and the deeply spiritual culture that revolves around Mother Ganga.',
        highlights: [
            'Evening Ganga Aarti at Dashashwamedh Ghat',
            'Sunrise boat ride on the Ganges',
            'Visit Kashi Vishwanath Temple',
            'Explore the ancient ghats and their history',
            'Traditional Banarasi silk saree demonstration',
        ],
        duration: '4 Days / 3 Nights',
        groupSize: '15-25 participants',
    },
};

export default function TripDetailPage() {
    const params = useParams();
    const slug = typeof params.slug === 'string' ? params.slug : '';
    const trip = TRIPS_DATA[slug];

    if (!trip) {
        return (
            <main className="bg-black min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-white mb-4">Trip Not Found</h1>
                    <p className="text-white/60 text-lg mb-8">The trip you&apos;re looking for doesn&apos;t exist.</p>
                    <Link
                        href="/trips"
                        className="inline-block px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300"
                    >
                        ← Back to Trips
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-black min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[70vh] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={trip.image}
                        alt={trip.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />
                </div>

                <div className="absolute inset-0 flex items-end pb-16 z-10">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
                        <Link
                            href="/trips"
                            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors duration-300 group"
                        >
                            <svg
                                className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Retreats
                        </Link>

                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase text-white/70 bg-white/10 border border-white/10 backdrop-blur-md mb-4">
                            {trip.label}
                        </span>

                        <RevealText
                            type="chars"
                            className="text-4xl md:text-7xl font-bold text-white tracking-tight"
                            stagger={0.02}
                        >
                            {trip.title}
                        </RevealText>

                        <div className="flex gap-6 mt-6">
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {trip.duration}
                            </div>
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {trip.groupSize}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
                    {/* Description */}
                    <div className="lg:col-span-3">
                        <h2 className="text-2xl font-semibold text-white mb-6">About This Journey</h2>
                        <p className="text-white/70 text-lg leading-relaxed">
                            {trip.description}
                        </p>
                    </div>

                    {/* Highlights */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-semibold text-white mb-6">Highlights</h2>
                        <ul className="space-y-4">
                            {trip.highlights.map((highlight, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="mt-1.5 w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                                    <span className="text-white/70 leading-relaxed">{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-20 text-center">
                    <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600">
                        <button className="px-12 py-4 rounded-full bg-black text-white font-medium text-lg hover:bg-transparent transition-all duration-500">
                            Register Interest
                        </button>
                    </div>
                    <p className="text-white/40 text-sm mt-4">Limited seats available. We&apos;ll reach out with details.</p>
                </div>
            </section>
        </main>
    );
}
