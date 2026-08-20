import React from 'react'
import RevealText from '../animation/RevealText'
import Image from 'next/image'
import InfiniteImageSlider from './InfiniteImageSlider'

function NewHero() {
    return (
        <section className="h-screen flex items-center relative overflow-hidden">
            {/* <div className="absolute z-0! top-[10px] w-screen aspect-square pointer-events-none"><div className="absolute inset-0 blur-[100px] rounded-full opacity-60" style={{
                backgroundImage: 'linear-gradient(261.26deg, #ff6a00 -11.86%, #fc964c -5.96%, #fc964c 5.45%, #f62003 30.99%, #ff6a00 62.85%, #f62003 101.39%, #fd7c34 103.82%)'
            }}></div><div className="absolute top-0 left-1/2 opacity-10 -translate-x-1/2 w-full h-full rounded-full border-b-4 border-[#ff6a00] shadow-[0_-20px_80px_rgba(255,114,13,0.5)]"></div></div> */}
            <div className="absolute h-full w-full bg-gradient-to-t from-black to-transparent bottom-0 opacity-70"></div>
            <RevealText
                as="h1"
                type="chars"
                className="mx-auto max-w-6xl mb-[20vh] my-2 md:py-32 !px-3 h-auto text-center md:text-[2.7rem] text-2xl"
                stagger={0.01}
            >
                We creates spaces for young people worldwide to have real and open conversations about life, faith and purpose
            </RevealText>
            <div className="absolute inset-x-0 bottom-6 z-10">
                <InfiniteImageSlider />
            </div>
        </section >
    )
}

export default NewHero