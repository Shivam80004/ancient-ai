import HeroBanner from '../components/home/HeroBanner'
import React from 'react'
import ScalingVideoSection from '../components/home/ScalingVideoSection'
import Testimonials from '../components/home/Testimonials'
import CallToAction from '../components/home/CallToAction'
import GallerySection from '../components/home/GallerySection'
import MarqueeLogo from '../components/home/MarqueeLogo'
import JsonLd from "@/components/seo/JsonLd"
import { organizationSchema, websiteSchema } from "@/lib/seo/structured-data"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ancient AI Academy — A Better Human Experience',
  description:
    'Strengthen your mind, body, and soul with Ancient AI Academy. Explore transformative courses, mentorship, free resources, and sacred retreats rooted in timeless wisdom.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Ancient AI Academy — A Better Human Experience',
    description:
      'Transformative wisdom for every stage of your journey — courses, mentorship, and retreats.',
    url: '/',
    type: 'website',
  },
}

function page() {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />

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