'use client';
import React from 'react';
import Link from 'next/link';

interface CardProps {
    title: string;
    description: string;
    category?: string;
    link?: string;
    thumbnail?: string | null;
}

const Card: React.FC<CardProps> = ({ title, description, category, link = "#", thumbnail = null }) => {
    return (
        <Link href={link} className="group relative flex flex-col h-full overflow-hidden rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all duration-500">
            {/* Hover Gradient Background (visible on full card hover) */}
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {thumbnail ? (
                <div className="relative h-56 w-full overflow-hidden shrink-0">
                    <img
                        src={thumbnail}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60" />
                </div>
            ) : (
                <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-50 transition-transform duration-500" />
            )}

            <div className="relative flex flex-col p-8 grow z-10">
                {category && (
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-orange-400 uppercase bg-orange-500/10 rounded-full border border-orange-500/20 w-fit">
                        {category}
                    </span>
                )}

                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4 group-hover:text-orange-100 transition-colors leading-tight">
                    {title}
                </h3>

                <p className="text-white/60 font-light leading-relaxed mb-8 line-clamp-3">
                    {description}
                </p>

                <div className="mt-auto flex items-center text-orange-400 font-medium group/btn">
                    <span className="mr-2 text-sm uppercase tracking-widest">Learn More</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>
        </Link>
    );
};

export default Card;
