'use client';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable, ScrollTrigger } from 'gsap/all';
import CarouselCard from './CarouselCard';

gsap.registerPlugin(Draggable, ScrollTrigger);

interface Course {
    title: string;
    description: string;
    category: string;
    image: string;
    slug: string;
}

interface CoursesCarouselProps {
    courses: Course[];
}

const CoursesCarousel: React.FC<CoursesCarouselProps> = ({ courses }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const wheelRef = useRef<HTMLDivElement>(null);
    const [radius, setRadius] = useState(0);

    // Calculate radius based on number of cards and width
    // C = 2 * pi * r
    // We want the cards to form a circle with some gap
    useEffect(() => {
        const updateRadius = () => {
            const cardWidth = window.innerWidth < 768 ? 320 : 450; // Card width + gap
            const totalWidth = cardWidth * courses.length;
            const newRadius = Math.round(totalWidth / (2 * Math.PI));
            setRadius(Math.max(newRadius, window.innerWidth < 768 ? 400 : 800)); // Minimum radius to ensure flat-ish look
        };

        updateRadius();
        window.addEventListener('resize', updateRadius);
        return () => window.removeEventListener('resize', updateRadius);
    }, [courses.length]);


    useEffect(() => {
        if (!radius || !wheelRef.current) return;

        const wheel = wheelRef.current;
        const cards = gsap.utils.toArray<HTMLElement>('.carousel-card-container');
        const totalCards = cards.length;
        const sliceAngle = 360 / totalCards;

        // Position cards in 3D space
        gsap.set(cards, {
            transformOrigin: `center center -${radius}px`,
            z: radius,
            rotationY: (i) => i * -sliceAngle,
        });

        // Initialize Draggable
        const proxy = document.createElement("div"); // Invisible proxy for dragging logic

        const rotationSpeed = 0.5; // Reduce rotation speed for smoother drag (0.5 = half speed)

        const updateRotation = () => {
            const rotation = gsap.getProperty(proxy, "x") as number;
            gsap.set(wheel, { rotationY: rotation * rotationSpeed });
        };

        const draggable = Draggable.create(proxy, {
            trigger: containerRef.current,
            type: "x",
            inertia: true,
            edgeResistance: 0.65,
            resistance: 2000,
            onDrag: updateRotation,
            onThrowUpdate: updateRotation,
            snap: {
                x: (val) => Math.round(val / (sliceAngle / rotationSpeed)) * (sliceAngle / rotationSpeed)
            }
        })[0];

        // Scroll interaction
        // Rotate the wheel as user scrolls down/up
        // We'll map scroll progress to rotation
        ScrollTrigger.create({
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: (self) => {
                // Determine direction
                // If dragging, don't interfere too much, or blend?
                // For this implementation, let's allow drag to be primary, 
                // but maybe auto-rotate if not interacting?
                // Or mapped: Scroll Y moves the carousel rotation

                // Let's make scroll ADD to the rotation for a continuous feel
                if (!draggable.isDragging && !draggable.isThrowing) {
                    const scrollRot = self.scroll() * 0.2; // Adjusted scroll speed
                    // Apply to proxy and update
                    // gsap.set(proxy, { x: -scrollRot });
                    // updateRotation();
                }
            }
        });

        // Initial intro animation - Disabled
        gsap.set(wheel, { opacity: 1, scale: 1, rotationY: 0 });

        // Auto-rotation
        const autoRotateSpeed = 0.01; // Speed (adjusted for rotationSpeed factor)
        const autoRotate = () => {
            if (!draggable.isDragging && !draggable.isPressed && !draggable.isThrowing) {
                const currentRotation = gsap.getProperty(proxy, "x") as number;
                gsap.set(proxy, { x: currentRotation - autoRotateSpeed });
                updateRotation();
            }
        };
        gsap.ticker.add(autoRotate);

        return () => {
            gsap.ticker.remove(autoRotate);
            draggable.kill();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };

    }, [radius, courses.length]);

    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorTextRef = useRef<HTMLDivElement>(null);

    // Custom Cursor Logic
    useEffect(() => {
        const cursor = cursorRef.current;
        const cursorText = cursorTextRef.current;

        if (!cursor || !cursorText) return;

        const moveCursor = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.2, // slight lag for smooth feel
                ease: "power2.out"
            });
        };

        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, []);

    const handleCursorChange = (isActive: boolean) => {
        const cursor = cursorRef.current;
        const cursorText = cursorTextRef.current;
        if (!cursor || !cursorText) return;

        if (isActive) {
            gsap.to(cursor, {
                scale: 4,
                backgroundColor: "#fff",
                opacity: 0.9,
                duration: 0.3
            });
            gsap.to(cursorText, {
                opacity: 1,
                scale: 0.25, // Scale down text to fit in large cursor if needed or keep it separate
                duration: 0.3
            });
        } else {
            gsap.to(cursor, {
                scale: 1,
                backgroundColor: "#fb1e01",
                opacity: 1,
                duration: 0.3
            });
            gsap.to(cursorText, {
                opacity: 0,
                duration: 0.3
            });
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center perspective-3000 cursor-none"
            style={{
                perspective: "2000px",
            }}
        >
            {/* Custom Cursor */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-6 h-6 bg-[#fb1e01] rounded-full pointer-events-none z-50 -translate-x-1/2 translate-y-[-10vh]! mix-blend-difference flex items-center justify-center"
            >
                <span ref={cursorTextRef} className="text-black font-bold text-[10px] uppercase opacity-0 whitespace-nowrap">Enroll Now</span>
            </div>

            {/* <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black pointer-events-none z-10" /> */}

            <div
                ref={wheelRef}
                className="relative w-[300px] h-[450px] md:w-[400px] md:h-[300px] transform-style-3d"
            >
                {courses.map((course, i) => (
                    <div
                        key={i}
                        className="carousel-card-container absolute inset-0 transform-style-3d"
                    >
                        <CarouselCard
                            {...course}
                            index={i}
                            onCursorChange={handleCursorChange}
                        />
                    </div>
                ))}
            </div>

            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 text-white bg-white/15 p-3 rounded-xl text-xs uppercase tracking-widest pointer-events-none z-20">
                Drag to Explore
            </div>
        </div>
    );
};

export default CoursesCarousel;
