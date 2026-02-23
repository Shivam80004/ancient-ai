import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy — Ancient AI",
    description: "Learn how Ancient AI collects, uses, and protects your personal information.",
};

const sections = [
    {
        title: "1. Information We Collect",
        content: `We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, register for an event, or contact us for support.

This may include:
• Name and email address
• Phone number (if provided)
• Payment information (processed securely via third-party providers)
• Content you submit, such as messages or feedback
• Device information and usage data collected automatically via cookies and analytics tools`,
    },
    {
        title: "2. How We Use Your Information",
        content: `We use the information we collect to:
• Provide, maintain, and improve our services
• Process transactions and send related information
• Send promotional communications (you may opt out at any time)
• Respond to comments, questions, and requests
• Monitor and analyse trends, usage, and activity in connection with our services
• Detect and prevent fraudulent or illegal activity`,
    },
    {
        title: "3. Sharing of Information",
        content: `We do not sell, trade, or rent your personal information to third parties. We may share your information with:
• Service providers who assist us in operating our platform (e.g., payment processors, email services)
• Legal authorities when required by law or to protect our rights
• Business partners with your consent

All third-party service providers are contractually obligated to keep your information confidential.`,
    },
    {
        title: "4. Data Retention",
        content: `We retain personal information for as long as necessary to fulfil the purposes for which it was collected, including complying with legal, accounting, or reporting obligations. When data is no longer needed, we securely delete or anonymise it.`,
    },
    {
        title: "5. Security",
        content: `We implement industry-standard security measures — including encryption, access controls, and secure infrastructure — to protect your information from unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.`,
    },
    {
        title: "6. Your Rights",
        content: `Depending on your jurisdiction, you may have the right to:
• Access the personal information we hold about you
• Request correction of inaccurate data
• Request deletion of your data
• Object to or restrict processing of your data
• Data portability

To exercise these rights, contact us at support@ancient.ai.`,
    },
    {
        title: "7. Cookies",
        content: `We use cookies and similar tracking technologies to enhance your experience. Please refer to our Cookie Policy for detailed information on the types of cookies we use and how to manage them.`,
    },
    {
        title: "8. Children's Privacy",
        content: `Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.`,
    },
    {
        title: "9. Changes to This Policy",
        content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the effective date. Your continued use of our services after any changes constitutes your acceptance of the updated policy.`,
    },
    {
        title: "10. Contact Us",
        content: `If you have any questions about this Privacy Policy, please contact us at:\n\nsupport@ancient.ai`,
    },
];

export default function PrivacyPolicyPage() {
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
                    Privacy Policy
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
                    At <span className="text-white font-medium">Ancient AI</span>, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.
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
