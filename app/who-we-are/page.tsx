import Intro from '@/components/who-we-are/Intro';
import OurTeam from '@/components/who-we-are/OurTeam';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Who We Are",
    description: "Meet the people and purpose behind Ancient AI Academy — our mission, our team, and the wisdom that guides our work.",
    alternates: { canonical: "/who-we-are" },
    openGraph: {
        title: "Who We Are | Ancient AI Academy",
        description: "Meet the people and purpose behind Ancient AI Academy.",
        url: "/who-we-are",
        type: "website",
    },
};

export default function WhoWeAre() {
    return (
        <main className="bg-black min-h-screen w-full">
            <Intro />
            <OurTeam />
        </main>
    );
}
