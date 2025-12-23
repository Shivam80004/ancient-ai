"use client"
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const Card = ({ image, title, text, className }) => {
  return (
    <div
      className={`group fake-card relative overflow-hidden rounded-3xl !w-full bg-white/5 p-4 backdrop-blur-2xl transition-all duration-500 hover:border-white/20 hover:bg-white/10 ${className}`}
    >
      <div className="relative aspect-4/5 h-[180px] !w-[280px] overflow-hidden rounded-2xl">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
      </div>
      <div className="mt-6 space-y-2 px-2">
        <h3 className="text-xl font-medium text-white/90">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-400">{text}</p>
      </div>
    </div>
  );
};

const FakeWorld = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".fake-card",
        {
          opacity: 0,
          y: 40
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const cards = [
    {
      image: "/Artificial_energy_from_202512231616.jpeg",
      title: "Synthetic Vigor",
      text: "Artificial energy hijacked from caffeine, masking the soul's exhaustion.",
      className: "w-[320px] md:w-[380px] lg:translate-x-[-10%] lg:translate-y-[10%]"
    },
    {
      image: "/Peace_from_weekend_202512231617.jpeg",
      title: "Escapist Zen",
      text: "Transactional peace bought from weekend getaways, forgotten by Monday morning.",
      className: "w-[320px] md:w-[380px] lg:translate-x-[20%] lg:translate-y-[-5%]"
    },
    {
      image: "/Confidence_from_filters_202512231618.jpeg",
      title: "Digital Armor",
      text: "Confidence manufactured through filters, crumbling without the screen.",
      className: "w-[320px] md:w-[380px] lg:translate-x-[-15%] lg:translate-y-[20%]"
    },
    {
      image: "/Relationships_maintained_by_202512231619.jpeg",
      title: "Emoji Echoes",
      text: "Relationships maintained by cold pixels and emojis, starving for presence.",
      className: "w-[320px] md:w-[380px] lg:translate-x-[10%] lg:translate-y-[5%]"
    }
  ];

  return (
    <section ref={containerRef} className="relative min-h-screen w-full overflow-hidden px-4 py-32">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(50% 50% at 50% 0%, rgba(136, 19, 55, 1) 0%, transparent 100%)'
        }}
      />

      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center">
        {/* Main Title Area */}
        <div className="mb-24 text-center space-y-4">
          <h2 className="text-4xl md:text-7xl font-medium tracking-tight text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
            Artificial Everywhere.<br />
            <span className="text-[#81e3f8]">Real & Authentic?</span> Nowhere.
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            We've built a world of high-definition simulations, trading true presence for polished performance.
          </p>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-16 xl:gap-10">
          {cards.map((card, i) => (
            <Card key={i} {...card} className={`fake-card ${card.className}`} />
          ))}
        </div>

        {/* Closing Text */}
        <div className="mt-32 text-center">
          <button className="group relative px-10 py-4 bg-white/5 border border-white/10 rounded-full overflow-hidden transition-all hover:border-white/30 backdrop-blur-md">
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-rose-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative text-white font-medium text-lg tracking-wider">
              RECLAIM REALITY
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FakeWorld;

