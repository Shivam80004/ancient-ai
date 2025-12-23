import React from 'react';

const FakeWorld = () => {
  return (
    <section className="relative min-h-[80vh] w-full bg-black flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(50% 50% at 50% 0%, rgba(136, 19, 55, 1) 0%, transparent 100%)'
        }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      {/* Central Card Container */}
      <div className="relative max-w-5xl w-full py-24 px-8 border-[0.5px] border-white/5 rounded-sm backdrop-blur-sm bg-white/1">
        {/* Glowing Corner Nodes (Hexagonal-ish) */}
        <div className="absolute -top-[4px] -left-[4px] w-2.5 h-2.5 bg-white shadow-[0_0_15px_#fff] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" />
        <div className="absolute -top-[4px] -right-[4px] w-2.5 h-2.5 bg-white shadow-[0_0_15px_#fff] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" />
        <div className="absolute -bottom-[4px] -left-[4px] w-2.5 h-2.5 bg-white shadow-[0_0_15px_#fff] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" />
        <div className="absolute -bottom-[4px] -right-[4px] w-2.5 h-2.5 bg-white shadow-[0_0_15px_#fff] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" />

        <div className="flex flex-col items-center text-center space-y-8">
          {/* Main Title with Glow */}
          <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
            Artificial Everywhere.
            <br />
            Real & Authentic? Nowhere!</h2>

          {/* Subtext */}
          <p className="max-w-2xl text-lg md:text-xl text-gray-400 font-light leading-relaxed">
            No setup friction. No integration delays.<br />
            Go from zero to live detection in minutes, with a seamless onboarding experience.
          </p>

          {/* CTA Button */}
          <button className="group relative px-8 py-3 bg-black border border-white/10 rounded-lg overflow-hidden transition-all hover:border-white/30">
            {/* Hover glow line */}
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-rose-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <span className="relative text-white font-medium text-sm tracking-wide">
              Learn more about Baits
            </span>
          </button>
        </div>
      </div>
    </section >
  );
};

export default FakeWorld;
