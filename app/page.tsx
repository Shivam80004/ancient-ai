import HeroBanner from '../components/HeroBanner'
import React from 'react'
import ScalingVideoSection from '../components/ScalingVideoSection'
import FakeWorld from '../components/FakeWorld'
import Footer from '../components/Footer'
import DeepLayerSection from '../components/DeepLayerSection'

function page() {
  return (
    <>

      <div id="home">
        <HeroBanner />
      </div>

      <div id="experience">
        <ScalingVideoSection />
      </div>

      <div id="the-illusion">
        <FakeWorld />
      </div>

      <DeepLayerSection />

      <Footer />

    </>
  )
}

export default page