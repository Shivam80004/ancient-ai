import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cookie Policy — Ancient AI",
    description: "Understand how Ancient AI uses cookies and similar technologies on our platform.",
};

const sections = [
    {
        title: "1. What Are Cookies?",
        content: `Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently, remember your preferences, and provide information to the site owners.`,
    },
    {
        title: "2. How We Use Cookies",
        content: `Ancient AI uses cookies and similar tracking technologies for the following purposes:

• Essential Cookies — Required for the website to function correctly. These cannot be disabled.
• Performance & Analytics Cookies — Help us understand how visitors interact with our site (e.g., pages visited, time spent, errors encountered). Data is aggregated and anonymous.
• Functional Cookies — Remember your preferences and settings to enhance your experience (e.g., language, region).
• Marketing Cookies — Used to deliver relevant content and measure the effectiveness of our campaigns. These are only active if you have given consent.`,
    },
    {
        title: "3. Types of Cookies We Use",
        content: `Session Cookies
Temporary cookies that are deleted when you close your browser. Used to maintain your session while browsing.

Persistent Cookies
Remain on your device for a set period or until you delete them manually. Used to remember your preferences across visits.

First-Party Cookies
Set directly by Ancient AI.

Third-Party Cookies
Set by our trusted partners (e.g., analytics providers, payment processors). These parties have their own privacy policies governing the use of this data.`,
    },
    {
        title: "4. Third-Party Services",
        content: `We may use third-party services that set their own cookies, including:
• Google Analytics — for website usage analytics
• Payment processors — for secure transaction handling
• Embedded media providers — for video and interactive content

We encourage you to review the privacy and cookie policies of these third parties.`,
    },
    {
        title: "5. Managing Cookies",
        content: `You can control and manage cookies in several ways:

Browser Settings
Most browsers allow you to refuse or delete cookies through their settings. Refer to your browser's help documentation for instructions.

Opt-Out Tools
You may opt out of certain analytics cookies using tools such as Google Analytics Opt-out Browser Add-on.

Note: Disabling certain cookies may affect the functionality of our website and your experience.`,
    },
    {
        title: "6. Cookie Consent",
        content: `Where required by law, we will request your consent before placing non-essential cookies on your device. You may withdraw your consent at any time by adjusting your browser settings or contacting us.`,
    },
    {
        title: "7. Updates to This Policy",
        content: `We may update this Cookie Policy periodically to reflect changes in our practices or for operational, legal, or regulatory reasons. We will notify you of significant changes by updating the effective date on this page.`,
    },
    {
        title: "8. Contact",
        content: `If you have any questions about our use of cookies or this policy, please contact us at:\n\nsupport@ancient.ai`,
    },
];

export default function CookiePolicyPage() {
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
                    Cookie Policy
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
                    This Cookie Policy explains how{" "}
                    <span className="text-white font-medium">Ancient AI</span> uses cookies and similar tracking technologies when you visit our website. By continuing to use our site, you agree to the use of cookies as described in this policy.
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
