"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ParallaxImage = ({
    src,
    alt = "",
    className = "",
    scale = 1,
    yMove = 180,
}) => {
    const containerRef = useRef(null);
    const imgRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current || !imgRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                imgRef.current,
                { y: -yMove, scale },
                {
                    y: yMove,
                    scale: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top bottom",   // when image enters viewport
                        end: "bottom top",     // when image leaves viewport
                        scrub: true,
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [scale, yMove]);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${className}`}
            style={{ willChange: "transform" }}
        >
            <div ref={imgRef} className="w-full h-full relative">
                <Image
                    src={src}
                    alt={alt}
                    className="object-cover"
                    priority
                    height={1080}
                    width={1920}
                />
            </div>
        </div>
    );
};

export default ParallaxImage;
