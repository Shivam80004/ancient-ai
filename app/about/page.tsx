import Hero from '@/components/about/hero'
import AnimatedText from '@/components/animation/AnimatedText'
import EasyPeasySection from '@/components/about/EasyPeasySection'
import ImpactStats from '@/components/who-we-are/ImpactStats'
import OurTeam from '@/components/who-we-are/OurTeam'

function AboutPage() {
    return (
        <main className="bg-black">
            <Hero />

            <section className="px-4 md:px-8">
                <AnimatedText className="mx-auto max-w-6xl my-2 py-32 h-auto text-center">
                    <div className="text-4xl md:text-[2rem] text-center font-normal p-16 text-white relative">
                        {/* Background Gradient Blur */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full p-5 rounded-full blur-[40px] pointer-events-none  bg-gradient-to-br from-[#F62003] via-[#000000] to-[#F62003]" />
                        <h2 className='font-semibold text-4xl'>In our well-designed sessions people understand:</h2>
                        <p className='mt-4 font-light text-3xl'>The science behind how they should live their lives with a higher sense of purpose and cultivate the Spiritual Intelligence which is exclusively meant to be done in the rare human for of life.</p>
                        <p className='!m-0 font-light text-3xl '>because with<span className='font-semibold text-[#f15906] ml-3 text-3xl'>GREAT POWER COMES GREAT RESPONSIBILITY!</span></p>
                    </div>
                </AnimatedText>
            </section >

            <EasyPeasySection />

            <ImpactStats />

            <OurTeam />
        </main>
    )
}

export default AboutPage