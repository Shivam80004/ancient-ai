import type { Metadata } from "next";
import { AcademyHero } from "@/components/academy/AcademyHero";
import { AcademyManifesto } from "@/components/academy/AcademyManifesto";
import { AcademyDifference } from "@/components/academy/AcademyDifference";
import SpatialSlider from "@/components/academy/SpatialSlider";
import Image from "next/image";

export const metadata: Metadata = {
    title: "The Academy",
    description:
        "Ancient AI Academy — the education our schools forgot. Timeless wisdom for the mind, body & soul.",
    alternates: { canonical: "/academy" },
    openGraph: {
        title: "Ancient AI Academy",
        description: "The education our schools forgot.",
        url: "/academy",
        type: "website",
    },
};

export default function AcademyPage() {
    return (
        <main className="bg-[#0A0A0A] text-white">
            <AcademyHero />
            <AcademyManifesto />
            <SpatialSlider />

            <div className="h-screen w-full flex items-center justify-center p-18">
                <Image src="/images/acadmey/mokup.png" alt="Placeholder" width={500} height={500} className="h-full w-[80%] object-cover"/>
            </div>
            {/* <AcademyDifference /> */}
        </main>
    );
}
