import HeroBanner from '../components/HeroBanner'
import React from 'react'
import ScalingVideoSection from '../components/ScalingVideoSection'
import FakeWorld from '../components/FakeWorld'
import Footer from '../components/Footer'
import DeepLayerSection from '../components/DeepLayerSection'
import Testimonials from '../components/Testimonials'
import CallToAction from '../components/CallToAction'
import GallerySection from '../components/GallerySection'
import MarqueeLogo from '../components/MarqueeLogo'

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

      {/* <Footer /> */}

    </>
  )
}

export default page