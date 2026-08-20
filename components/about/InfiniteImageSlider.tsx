'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

const images = [
  '/gellery-img/gallery-img-1.jpg',
  '/gellery-img/gallery-img-2.webp',
  '/gellery-img/gallery-img-3.jpg',
  '/gellery-img/gallery-img-4.jpeg',
  '/gellery-img/gallery-img-5.png',
  '/gellery-img/gallery-img-6.png',
  '/gellery-img/gallery-img-7.png',
  '/gellery-img/gallery-img-8.png',
  '/gellery-img/gallery-img-9.jpg',
];

const InfiniteImageSlider = () => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = rowRef.current;

    // Move -33.33% because we render 3 sets of images.
    // 1 set = 33.33% of total width, which makes the loop seamless.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { xPercent: 0 },
        {
          xPercent: -33.33,
          duration: 40,
          ease: 'none',
          repeat: -1,
        }
      );
    }, rowRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative flex overflow-hidden py-6 fading-edge-mask">
      <div ref={rowRef} className="flex w-max gap-4 md:gap-6">
        {/* Render 3 sets of images to ensure seamless looping. */}
        {[...images, ...images, ...images].map((src, i) => (
          <div
            key={i}
            className={`relative shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-2xl w-[130px] h-[170px] sm:w-[150px] sm:h-[190px] md:w-[280px] md:h-[230px] ${i % 2 === 0 ? '-rotate-6' : 'rotate-6'}`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width:768px) 150px, 180px"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .fading-edge-mask {
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }
      `}</style>
    </div>
  );
};

export default InfiniteImageSlider;
