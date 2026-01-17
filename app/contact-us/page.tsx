import React from 'react';
import PageHero from '@/components/ui/PageHero';

export default function ContactPage() {
    return (
        <main className="bg-black min-h-screen text-white">
            <PageHero
                title="Contact Us"
                subtitle="Have questions? We are here to help guide you."
                image="/images/hero-contact.jpg"
            />

            <section className="py-20 px-4 md:px-8 max-w-2xl mx-auto">
                <form className="space-y-6 bg-white/5 p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm uppercase tracking-wider text-white/60">Name</label>
                            <input type="text" className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="Your Name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm uppercase tracking-wider text-white/60">Email</label>
                            <input type="email" className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="your@email.com" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm uppercase tracking-wider text-white/60">Subject</label>
                        <input type="text" className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="How can we help?" />
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
