import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service — Ancient AI",
    description: "Read the terms and conditions governing your use of the Ancient AI platform and services.",
};

const sections = [
    {
        title: "1. Acceptance of Terms",
        content: `By accessing or using Ancient AI's website, applications, or services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services.

These Terms apply to all visitors, users, and others who access or use the Services.`,
    },
    {
        title: "2. Use of Services",
        content: `You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree not to:
• Use the Services in any way that violates applicable laws or regulations
• Attempt to gain unauthorised access to any part of the Services or related systems
• Transmit harmful, offensive, or disruptive content
• Impersonate any person or entity
• Scrape, copy, or distribute any content from our Services without written permission`,
    },
    {
        title: "3. Account Registration",
        content: `To access certain features, you may be required to create an account. You are responsible for:
• Maintaining the confidentiality of your account credentials
• All activities that occur under your account
• Promptly notifying us of any unauthorised use of your account

We reserve the right to terminate accounts that violate these Terms.`,
    },
    {
        title: "4. Intellectual Property",
        content: `All content, features, and functionality of the Services — including but not limited to text, graphics, videos, logos, and software — are the exclusive property of Ancient AI and are protected by copyright, trademark, and other intellectual property laws.

You may not reproduce, distribute, modify, or create derivative works of any content without our prior written consent.`,
    },
    {
        title: "5. Payments & Refunds",
        content: `Certain Services may require payment. By completing a purchase, you agree to our pricing and payment terms presented at checkout. Refund eligibility is determined on a case-by-case basis. For refund requests, please contact support@ancient.ai within 7 days of purchase.`,
    },
    {
        title: "6. Third-Party Links",
        content: `Our Services may contain links to third-party websites or services. These are provided for your convenience only. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites.`,
    },
    {
        title: "7. Disclaimer of Warranties",
        content: `The Services are provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied. We do not warrant that the Services will be uninterrupted, error-free, or free of viruses or other harmful components.`,
    },
    {
        title: "8. Limitation of Liability",
        content: `To the fullest extent permitted by law, Ancient AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of — or inability to use — the Services, even if we have been advised of the possibility of such damages.`,
    },
    {
        title: "9. Indemnification",
        content: `You agree to indemnify, defend, and hold harmless Ancient AI, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in connection with your use of the Services or violation of these Terms.`,
    },
    {
        title: "10. Governing Law",
        content: `These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in India.`,
    },
    {
        title: "11. Changes to Terms",
        content: `We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating the date at the top of this page. Your continued use of the Services after any changes constitutes acceptance of the updated Terms.`,
    },
    {
        title: "12. Contact",
        content: `For questions regarding these Terms, please contact us at:\n\nsupport@ancient.ai`,
    },
];

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Hero */}
            <section className="relative flex flex-col items-center justify-center pt-40 pb-20 px-6 text-center overflow-hidden">
                {/* Glow */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[120px] opacity-20 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse, #f62003 0%, transparent 70%)" }}
                />
                <span className="text-xs font-semibold tracking-[0.3em] uppercase text-orange-500/80 mb-6">
                    Legal
                </span>
                <h1 className="text-4xl md:text-6xl font-light text-white mb-4 leading-tight">
                    Terms of Service
                </h1>
                <p className="text-white/40 text-sm md:text-base max-w-xl">
                    Effective date: <span className="text-white/60">February 23, 2026</span>
                </p>
            </section>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Content */}
            <section className="max-w-3xl mx-auto px-6 py-20 flex flex-col gap-14">
                <p className="text-white/60 text-base leading-relaxed">
                    Please read these Terms of Service carefully before using the{" "}
                    <span className="text-white font-medium">Ancient AI</span> platform. These Terms outline your rights and responsibilities as a user of our Services.
                </p>

                {sections.map((section, i) => (
                    <div key={i} className="flex flex-col gap-4">
                        <h2 className="text-lg md:text-xl font-semibold text-white/90">
                            {section.title}
                        </h2>
                        <p className="text-white/55 text-sm md:text-base leading-relaxed whitespace-pre-line">
                            {section.content}
                        </p>
                    </div>
                ))}
            </section>

            {/* Bottom border */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </main>
    );
}
