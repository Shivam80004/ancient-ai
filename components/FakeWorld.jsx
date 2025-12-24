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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".fake-card",
        {
          opacity: 0,
          y: 60
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 1.2,
          ease: "power3.out",
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
      date: "05 - 2021",
      layout: "h-image-first",
      className: "md:col-span-2 md:row-span-1 h-[400px] md:h-[420px]"
    },
    {
      image: "/Peace_from_weekend_202512231617.jpeg",
      title: "Escapist Zen",
      text: "Transactional peace bought from weekend getaways, forgotten by Monday morning.",
      date: "10 - 2019",
      layout: "v-image-first",
      className: "md:col-span-1 md:row-span-2 h-[600px] md:h-full"
    },
    {
      image: "/Confidence_from_filters_202512231618.jpeg",
      title: "Digital Armor",
      text: "Confidence manufactured through filters, crumbling without the screen.",
      date: "02 - 2024",
      layout: "h-text-first",
      className: "md:col-span-2 md:row-span-1 h-[350px] md:h-[380px]"
    },
    {
      image: "/Relationships_maintained_by_202512231619.jpeg",
      title: "Emoji Echoes",
      text: "Relationships maintained by cold pixels and emojis, starving for presence.",
      date: "09 - 2023",
      layout: "h-text-first",
      className: "md:col-span-3 md:row-span-1 h-[350px] md:h-[380px]"
    }
  ];

  return (
    <section ref={containerRef} className="relative min-h-screen w-full overflow-hidden px-4 md:px-8 py-32">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(50% 50% at 50% 0%, rgba(255, 123, 0, 0.4) 0%, transparent 100%)'
        }}
      />

      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      <div className="relative mx-auto max-w-7xl">
        {/* Main Title Area */}
        <div className="mb-24 text-center space-y-4">
          <h2 className="text-5xl font-popins font-medium md:text-7xl text-white">
            Artificial Everywhere.<br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-[#ffd700] to-[#ff7b00] ">Real & Authentic?</span> Nowhere.
          </h2>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-400 font-light">
            We've built a world of high-definition simulations, trading true presence for polished performance.
          </p>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 auto-rows-fr">
          {cards.map((card, i) => (
            <Card key={i} {...card} />
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

