import ImpactStats from '@/components/who-we-are/ImpactStats'
import OurTeam from '@/components/who-we-are/OurTeam'
import type { Metadata } from 'next'
import NewHero from '@/components/about/NewHero'
import LayeredSlider from '@/components/about/LayeredSlider'

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about Ancient AI Academy, our impactful work, and the team driving transformative wisdom.',
    alternates: {
        canonical: '/about',
    }
}

function AboutPage() {
    return (
        <main className="bg-black">
            {/* <Hero /> */}

           <NewHero />

            <LayeredSlider />

            {/* <EasyPeasySection /> */}

            <ImpactStats />

            <OurTeam />
        </main>
    )
}

export default AboutPage