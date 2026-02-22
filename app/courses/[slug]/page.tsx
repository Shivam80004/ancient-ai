'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const CourseDetailPage = () => {
    const params = useParams();
    const slug = params.slug;

    // In a real app, fetch data based on slug
    // For now, we'll just display the slug title
    const formattedTitle = typeof slug === 'string'
        ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : 'Course Detail';

    return (
        <main className="min-h-screen bg-black text-white relative">
            <Link href="/courses" className="absolute top-8 left-8 z-50 flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Courses
            </Link>

            <section className="h-[60vh] relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-50">
                    <Image
                        src={`/gellery-img/gallery-img-${(Math.floor(Math.random() * 8) + 1)}.png`} // Random BG for demo
                        alt="Course Background"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
                </div>

                <div className="relative z-10 text-center px-4">
                    <span className="text-orange-500 tracking-[0.3em] text-sm font-bold uppercase mb-4 block">Ancient AI Academy</span>
                    <h1 className="text-5xl md:text-7xl font-bold font-poppins mb-6">{formattedTitle}</h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                        Dive deep into the wisdom of the ages. This course focuses on practical application of spiritual principles in modern life.
                    </p>
                </div>
            </section>

            <section className="py-20 px-4 md:px-8 max-w-4xl mx-auto">
                <div className="prose prose-invert prose-lg mx-auto">
                    <h3>Course Overview</h3>
                    <p>
                        This comprehensive module is designed to help you navigate the complexities of life with clarity and purpose.
                        Drawing from ancient texts and modern psychological insights, we explore the fundamental questions of existence.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                            <h4 className="text-xl font-bold mb-4 text-orange-400">What You'll Learn</h4>
                            <ul className="space-y-2 text-sm text-white/70">
                                <li>• Core principles of Vedic wisdom</li>
                                <li>• Practical mindfulness techniques</li>
                                <li>• Stress management strategies</li>
                                <li>• Leadership and decision making</li>
                            </ul>
                        </div>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                            <h4 className="text-xl font-bold mb-4 text-orange-400">Course Details</h4>
                            <ul className="space-y-2 text-sm text-white/70">
                                <li>• Duration: 4 Weeks</li>
                                <li>• Format: Online & Offline</li>
                                <li>• Level: Intermediate</li>
                                <li>• Certificate: Yes</li>
                            </ul>
                        </div>
                    </div>

                    <p>
                        Join a community of like-minded seekers and embark on a journey of self-discovery.
                        Unlock your potential and lead a life of fulfillment and joy.
                    </p>

                    <div className="mt-12 flex justify-center">
                        <Link href="/contact-us" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-orange-600 hover:text-white transition-colors duration-300">
                            Enroll Now
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default CourseDetailPage;
