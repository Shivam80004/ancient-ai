import React from 'react';
import PageHero from '@/components/ui/PageHero';
import RevealText from '@/components/animation/RevealText';

export default function ContactPage() {
    return (
        <main className="bg-black min-h-screen text-white">
            {/* <PageHero
                title="Contact Us"
                subtitle="Have questions? We are here to help guide you."
                image="/gellery-img/gallery-img-5.png"
            /> */}

            <div className="relative h-[80dvh] w-full overflow-hidden z-0">
                <img src="/gellery-img/gallery-img-5.png" alt="" className='h-full w-full object-cover object-top' />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

                {/* Content */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center px-4 w-full">
                    <div className="overflow-hidden mb-3">
                        <RevealText
                            type="chars"
                            className="text-5xl md:text-7xl font-semibold text-white tracking-tight"
                            stagger={0.03}
                        >
                            Contact Us
                        </RevealText>
                    </div>

                    <div className="mx-auto">
                        <RevealText
                            type="words"
                            className="text-xl md:text-2xl text-white/80 font-light leading-relaxed"
                            stagger={0.01}
                            delay={0.5}
                        >
                            We’d love to hear from you, Send us your thoughts and questions.
                        </RevealText>
                    </div>

                </div>

            </div>

            <section className="py-0 px-4 md:px-8 max-w-2xl mx-auto">
                <form className="space-y-6 bg-white/5 p-8 md:p-12 rounded-3xl border border-accent-warm/30 backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm uppercase tracking-wider text-white/60">
                                Name <span className="text-orange-500">*</span>
                            </label>
                            <input type="text" required className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="Your Name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm uppercase tracking-wider text-white/60">
                                Phone Number <span className="text-orange-500">*</span>
                            </label>
                            <input type="tel" required className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="+91 00000 00000" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm uppercase tracking-wider text-white/60">Email</label>
                        <input type="email" className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="your@email.com" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm uppercase tracking-wider text-white/60">
                            Subject <span className="text-orange-500">*</span>
                        </label>
                        <select required className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer"
                            defaultValue=""
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff60' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 16px center',
                            }}
                        >
                            <option value="" disabled className="bg-black text-white/50">Select a topic</option>
                            <option value="general" className="bg-black text-white">General Enquiry</option>
                            <option value="register-event" className="bg-black text-white">Event Registration</option>
                            <option value="collaboration" className="bg-black text-white">Collaboration</option>
                            <option value="feedback" className="bg-black text-white">Feedback</option>
                            <option value="volunteering" className="bg-black text-white">Volunteering</option>
                            <option value="other" className="bg-black text-white">Others</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm uppercase tracking-wider text-white/60">Message</label>
                        <textarea className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white h-32 focus:outline-none focus:border-orange-500 transition-colors" placeholder="Write your message here..."></textarea>
                    </div>

                    <button type="submit" className="w-full py-4 bg-linear-to-r from-orange-600 to-red-600 rounded-xl font-semibold text-white tracking-wide hover:opacity-90 transition-opacity">
                        Send Message
                    </button>
                </form>
            </section>
        </main>
    );
}
