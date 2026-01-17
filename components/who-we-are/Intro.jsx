'use client';
import React from 'react';
import ParallaxImage from '../animation/ParallaxImage';
import AnimatedText from '../animation/AnimatedText';
import RevealText from '../animation/RevealText';
import ImpactStats from './ImpactStats';

const Intro = () => {
    return (
        <>
            <section className="bg-black relative text-white min-h-screen flex flex-col items-center justify-center overflow-hidden">

                <ParallaxImage src="/gellery-img/gallery-img-5.png" alt="Intro" className="w-full h-full opacity-35" />

                <div className="max-w-6xl w-full mx-auto text-center space-y-12 z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4">
                    <div className="overflow-hidden m-0">
                        <RevealText
                            type="chars"
                            className="text-5xl md:text-8xl font-bold text-center mb-1 tracking-tight text-white"
                            stagger={0.03}
                        >
                            What is Ancient AI?
                        </RevealText>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <RevealText
                            type="words"
                            className="text-xl md:text-2xl text-white/90 text-center font-light leading-relaxed"
                            stagger={0.01}
                            delay={0.5}
                        >
                            Krishna Consciousness is a spiritual thought movement that paves the way for a unique journey of self-discovery. Whether you’re seeking answers to life’s questions, or searching for a close-knit community, Krishna Consciousness offers a pathway for everyone. All are welcome, no matter your background, faith, or prior experience!
                        </RevealText>
                    </div>
                </div>
            </section >
            <ImpactStats />
            <section
                className="px-4 md:px-8"
            >
                <AnimatedText className="mx-auto max-w-6xl my-2 text-center"
                >
                    <h2 className="text-4xl md:text-[2rem] font-normal p-16 text-white relative"
                    >
                        {/* Background Gradient Blur */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full p-5 rounded-full blur-[40px] pointer-events-none  bg-gradient-to-br from-[#F62003] via-[#000000] to-[#F62003]"
                        />
                        We aim to distil the wisdom from our spiritual giants and present it in a relatable format for the students of today. We take inspiration from the Bhagavad Gita, a powerful ancient text centred around a conversation between the warrior Arjuna, and Lord Krishna. This dialogue encompasses topics from science to self-identity, leadership to life-management, relationships to reconnecting with the divine. We cannot wait to share these with you!
                    </h2>
                </AnimatedText>
            </section>
        </>
    );
};

export default Intro;
