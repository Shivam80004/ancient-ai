import HeroBanner from '../components/home/HeroBanner'
import React from 'react'
import ScalingVideoSection from '../components/home/ScalingVideoSection'
import Testimonials from '../components/home/Testimonials'
import CallToAction from '../components/home/CallToAction'
import GallerySection from '../components/home/GallerySection'
import MarqueeLogo from '../components/home/MarqueeLogo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AncientAi Academy',
  alternates: {
    canonical: '/',
  }
}

function page() {
  return (
    <>

      <div id="home">
        <HeroBanner />
      </div>

      <div id="experience">
        <ScalingVideoSection />
      </div>

      <div id="gallery">
        <GallerySection />
      </div>

      {/* <div id="the-illusion">
        <FakeWorld />
      </div> */}

      {/* <DeepLayerSection /> */}

      <div id="partners">
        <MarqueeLogo />
      </div>

      <div id="testimonials">
        <Testimonials />
      </div>

      <div id="cta">
        <CallToAction />
      </div>

    </>
  )
}

export default page