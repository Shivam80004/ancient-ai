"use client"
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const Card = ({ image, title, text, date, layout = "v-image-first", className }) => {
  const isHorizontal = layout.startsWith('h-');
  const isTextFirst = layout.includes('-text-first');

  return (
    <div
      className={`group fake-card relative overflow-hidden rounded-[2.5rem] bg-amber-950/50 flex transition-all duration-500 hover:scale-[1.02] ${isHorizontal ? 'flex-row' : 'flex-col'} ${className}`}
    >
      {/* Split Layout Logic */}
      <div className={`flex ${isHorizontal ? 'flex-row w-full h-full' : 'flex-col w-full h-full'}`}>
        {isTextFirst ? (
          <>
            <TextSection title={title} text={text} date={date} isHorizontal={isHorizontal} />
            <ImageSection image={image} title={title} isHorizontal={isHorizontal} />
          </>
        ) : (
          <>
            <ImageSection image={image} title={title} isHorizontal={isHorizontal} />
            <TextSection title={title} text={text} date={date} isHorizontal={isHorizontal} />
          </>
        )}
      </div>
    </div>
  );
};

const TextSection = ({ title, text, date, isHorizontal }) => (
  <div className={`flex flex-col justify-between p-7 md:p-10 flex-1 min-w-0 ${isHorizontal ? 'w-1/2' : 'w-full'}`}>
    <div className="flex">
      <h3 className="text-3xl md:text-5xl font-bold text-white uppercase leading-[0.9] tracking-tighter">
        {title.split(' ').map((word, i) => (
          <span key={i} className="block">{word}</span>
        ))}
      </h3>
      {/* {date && <span className="text-xs md:text-sm font-semibold text-white/50 mt-1 whitespace-nowrap">{date}</span>} */}
    </div>
    <div className="mt-8">
      <p className="text-sm md:text-[0.95rem] text-white font-medium leading-relaxed max-w-[90%]">
        {text}
      </p>
    </div>
  </div>
);

const ImageSection = ({ image, title, isHorizontal }) => (
  <div className={`relative overflow-hidden ${isHorizontal ? 'w-1/2 h-full min-h-[300px]' : 'w-full h-1/2 min-h-[250px]'}`}>
    <img
      src={image}
      alt={title}
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-black/5 mix-blend-multiply transition-opacity group-hover:opacity-0" />
  </div>
);

const FakeWorld = () => {
  const containerRef = useRef(null);

  React.useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      // Parallax effect for scattered images
      const images = gsap.utils.toArray(".parallax-image");
      images.forEach((img) => {
        const speed = parseFloat(img.dataset.speed) || 0.2;
        gsap.to(img, {
          y: -800 * speed, // Amplify scroll speed
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        });
      });

      // Subtle scale and fade for the text
      gsap.fromTo(".hero-text-container",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 40%",
            end: "top 10%",
            scrub: true,
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const images = [
    { src: "/Artificial_energy_from_202512231616.jpeg", top: "10%", left: "5%", width: "18vw", speed: 0.2, z: "z-10" },
    { src: "/Peace_from_weekend_202512231617.jpeg", top: "25%", right: "10%", width: "22vw", speed: 0.4, z: "z-30" }, // In front of text
    { src: "/Confidence_from_filters_202512231618.jpeg", top: "45%", left: "15%", width: "16vw", speed: 0.1, z: "z-10" },
    { src: "/Relationships_maintained_by_202512231619.jpeg", top: "65%", right: "12%", width: "28vw", speed: 0.3, z: "z-10" },
    { src: "/Artificial_energy_from_202512231616.jpeg", top: "85%", left: "8%", width: "12vw", speed: 0.5, z: "z-30" },
  ];

  return (
    <section ref={containerRef} className="relative min-h-[200vh] w-full bg-[#030303] overflow-visible">

      {/* Pinned Viewport */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

        {/* Background Radial Glow (Subtle) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 123, 0, 0.1) 0%, transparent 80%)'
          }}
        />

        {/* Central Text Section */}
        <div className="hero-text-container z-20 text-center px-4 mix-blend-difference pointer-events-auto">
          <h2 className="text-6xl md:text-[7vw] font-medium text-white uppercase leading-[0.9] tracking-normal drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)]">
            Artificial <br /> Everywhere.<br />
            Authentic? <br /> Nowhere!
          </h2>
        </div>

      </div>

      {/* Scattered Parallax Images */}
      {images.map((img, i) => (
        <div
          key={i}
          className={`parallax-image absolute overflow-hidden rounded-xl shadow-4xl ${img.z} pointer-events-none`}
          style={{
            top: img.top,
            left: img.left,
            right: img.right,
            width: img.width,
            aspectRatio: "4/3",
          }}
          data-speed={img.speed}
        >
          <img
            src={img.src}
            alt="Scattered Visual"
            className="w-full h-full object-cover grayscale-[0.5] contrast-125 brightness-90 hover:grayscale-0 transition-all duration-1000"
          />
        </div>
      ))}

    </section>
  );
};

export default FakeWorld;

