import React from 'react'
import ParallaxImage from '../animation/ParallaxImage'
import Image from 'next/image'

function hero() {
    return (
        <section className='h-screen w-full bg-black'
        // style={{
        //     background: "linear-gradient(261.26deg, rgba(246, 32, 3, 0) -11.86%, #fc964c -5.96%, #fc964c 5.45%, #f62003 30.99%, rgba(246, 32, 3, 0) 62.85%, #f62003 101.39%, #fd7c34 103.82%)"
        // }}
        >

            <ParallaxImage src="/gellery-img/gallery-img-8.png" alt="Intro" className="w-full h-full opacity-25" />

            <div className='max-w-6xl absolute inset-0 text-center mx-auto flex flex-col items-center justify-center h-full'>
                <h1 className='text-3xl font-normal text-white'>Everyone is looking for :</h1>
                <div className='w-full h-auto flex flex-col items-center justify-center mt-3'>
                    <h3 className='text-6xl font-bold text-white'>SAT: Eternity</h3>
                    <h3 className='text-6xl font-bold text-white'>CIT: Knowledge</h3>
                    <h3 className='text-6xl font-bold text-white'>ANANDA: Bliss</h3>
                </div>
                <div className='w-full h-auto flex flex-col items-center justify-center '>
                    <p className='text-3xl font-light text-white'>
                        <span className='inline-block transform translate-y-6'>
                            <Image src="/logo-plain.png" alt="Logo" width={250} height={100} />
                        </span>
                        empowers people to add these ingredients in their mundane, tasteless and artificial lives & DESIGN AN EXTRAORDINARY LIFE with <span className='font-bold text-white'>UNPARALLELED BLISS AND HIGHER PURPOSE.</span></p>
                </div>

            </div>
        </section >
    )
}

export default hero