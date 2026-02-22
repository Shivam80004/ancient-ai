'use client';
import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';

interface ResourceCardProps {
    title: string;
    description: string;
    category: string;
    image: string;
    link?: string;
    type: 'pdf' | 'audio' | 'video' | 'tool' | 'ebook';
    index: number;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ title, description, category, image, link = "#", type, index }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const getActionLabel = () => {
        switch (type) {
            case 'pdf': return 'Download PDF';
            case 'ebook': return 'Read eBook';
            case 'audio': return 'Listen Now';
            case 'video': return 'Watch Video';
            case 'tool': return 'Open Tool';
            default: return 'Learn More';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'pdf': return (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            );
            case 'audio': return (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
            default: return (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            );
        }
    };

    return (
        <a
            href={link}
            className="block group w-full"
        >
            <div ref={cardRef} className="h-[430px] relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col hover:border-white/20 transition-colors duration-500 shadow-xl">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden shrink-0">
                    <div ref={imageRef} className="absolute inset-0 w-full h-full">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover transition-all duration-500"
                        />
                    </div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase tracking-widest rounded-full">
                            {category}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div ref={contentRef} className="p-6 flex flex-col grow relative z-10">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-accent-warm transition-colors duration-300 font-poppins leading-tight">
                        {title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 grow">
                        {description}
                    </p>

                    {/* Action Button */}
                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between group-hover:border-white/30 transition-colors duration-300">
                        <span className="text-white text-xs font-semibold uppercase tracking-wider group-hover:text-accent-warm transition-colors duration-300 flex items-center gap-2">
                            {getActionLabel()}
                            <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                                {getIcon()}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </a>
    );
};

export default ResourceCard;
