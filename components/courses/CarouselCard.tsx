'use client';
import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import Link from 'next/link';

interface CarouselCardProps {
    title: string;
    description: string;
    category: string;
    image: string;
    slug: string;
    index: number;
    onCursorChange?: (isActive: boolean) => void;
}

const CarouselCard: React.FC<CarouselCardProps> = ({ title, description, category, image, slug, index, onCursorChange }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        if (onCursorChange) onCursorChange(true);
        gsap.to(cardRef.current, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
        });
    };

    const handleMouseLeave = () => {
        if (onCursorChange) onCursorChange(false);
        gsap.to(cardRef.current, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    };

    return (
        <div ref={cardRef}
            className="carousel-card relative w-[80%] h-[350px] md:w-[400px] md:h-[270px] rounded-2xl overflow-hidden cursor-pointer group bg-zinc-900 border border-white/10 shrink-0"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link href={`/courses/${slug}`} className="block w-full h-full">
                <div className="absolute inset-0 h-full w-full">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 scale-105 group-hover:scale-100 opacity-60"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-start justify-end h-full transform transition-transform duration-500">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-medium text-white mb-4 border border-white/20">
                        {category}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight font-poppins">{title}</h3>
                    <p className="text-sm text-gray-300 line-clamp-3 mb-4 md:mb-0">
                        {description}
                    </p>
                    <div className="md:hidden w-full mt-2">
                        <span className="inline-block px-4 py-2 bg-[#fb1e01] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg">
                            Enroll Now
                        </span>
                    </div>
                </div>

            </Link>
        </div>
    );
};

export default CarouselCard;
