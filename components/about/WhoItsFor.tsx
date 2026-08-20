import Image from "next/image";
import { cn } from "@/lib/utils";

type Persona = {
    overline: string;
    title: string;
    story: string;
    image: string;
    featured?: boolean;
};

const PERSONAS: Persona[] = [
    {
        overline: "I can't stop asking",
        title: "The Big Questions",
        story: "Why am I here? What actually matters? You've never settled for easy answers — and that restless curiosity isn't a flaw to fix. It's the beginning of real wisdom.",
        image: "/gellery-img/gallery-img-4.jpeg",
    },
    {
        overline: "I'm going through a",
        title: "Transition in Life",
        story: "A chapter is closing — a career, a relationship, an old version of you. The ground feels unsteady, but this in-between is exactly where the next you is quietly being built.",
        image: "/gellery-img/gallery-img-2.webp",
    },
    {
        overline: "I am a",
        title: "Spiritual Seeker",
        story: "You feel the pull toward something deeper than the endless scroll. Not dogma, not noise — just meaning that actually holds when life gets heavy.",
        image: "/gellery-img/gallery-img-8.png",
        featured: true,
    },
    {
        overline: "I'm ready to",
        title: "Master Mind & Body",
        story: "You don't lack effort — you lack a compass. It's time to build a practice that trains the mind and spirit with the same intent you already give the body.",
        image: "/gellery-img/gallery-img-9.jpg",
    },
];

export default function WhoItsFor() {
    return (
        <section className="relative bg-black px-4 py-20 md:px-8 md:py-32">
            <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">
                    Who it&apos;s for
                </p>
                <h2
                    className="mt-3 text-3xl font-light text-white md:text-5xl"
                    style={{ fontFamily: "var(--font-oswald)" }}
                >
                    You didn&apos;t land here <span className="font-semibold">by accident</span>
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
                    Ancient AI is for the ones asking the bigger questions. However you arrived, there&apos;s a place for you here.
                </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 md:mt-16 md:gap-5 lg:grid-cols-4">
                {PERSONAS.map((p) => (
                    <article
                        key={p.title}
                        className={cn(
                            "group relative aspect-[4/5] overflow-hidden rounded-3xl border transition-colors",
                            p.featured ? "border-[#f15906]/40" : "border-white/10 hover:border-white/25"
                        )}
                    >
                        <Image
                            src={p.image}
                            alt=""
                            fill
                            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div
                            className={cn(
                                "absolute inset-0",
                                p.featured
                                    ? "bg-gradient-to-t from-black via-black/75 to-black/20"
                                    : "bg-gradient-to-t from-black/95 via-black/55 to-transparent"
                            )}
                        />
                        {p.featured && (
                            <div
                                aria-hidden
                                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_rgba(241,89,6,0.4),_transparent_60%)]"
                            />
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                            <p className="text-xs font-medium text-white/70 md:text-sm">{p.overline}</p>
                            <h3
                                className={cn(
                                    "mt-1 text-2xl font-bold uppercase leading-[0.95] tracking-tight text-white md:text-3xl",
                                    p.featured && "italic"
                                )}
                                style={{ fontFamily: "var(--font-oswald)" }}
                            >
                                {p.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-white/65">{p.story}</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
