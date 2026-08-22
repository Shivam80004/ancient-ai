import React from 'react'
import RevealText from '../animation/RevealText'
import Image from 'next/image'
import InfiniteImageSlider from './InfiniteImageSlider'

function NewHero() {
    return (
        <section className="h-screen flex items-center relative overflow-hidden">
             {/* Background Image/Overlay */}
            <div className="absolute inset-0 z-0">
                <Image src="/gellery-img/gallery-img-8.png" height={1000} width={700} alt="" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent" />
            </div>
            {/* <div className="absolute h-full w-full bg-gradient-to-t from-black to-blue-600 bottom-0 opacity-70"></div> */}
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