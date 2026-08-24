import type { Metadata } from "next";
import { AcademyHero } from "@/components/academy/AcademyHero";
import { AcademyManifesto } from "@/components/academy/AcademyManifesto";
import { AcademyDifference } from "@/components/academy/AcademyDifference";
import SpatialSlider from "@/components/academy/SpatialSlider";
import MembershipPerks from "@/components/academy/MembershipPerks";
import Image from "next/image";
import CallToAction from "@/components/academy/CallToAction";

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

            <div className="h-screen w-full flex flex-col gap-10 my-[100px] items-center justify-center p-18">

                <h2 className="text-3xl text-center md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-4">Our <span className="font-semibold">Platform</span></h2>

                <Image src="/images/acadmey/mokup.png" alt="Placeholder" width={500} height={500} className="h-full w-[80%] object-cover"/>
            </div>
            {/* <AcademyDifference /> */}

            <MembershipPerks />

            <CallToAction />
        </main>
    );
}
