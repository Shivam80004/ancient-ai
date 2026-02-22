// Shared mentorship program data — used by the list page and each inner [slug] page

export interface MentorshipProgram {
    slug: string;
    title: string;
    description: string;
    category: string;
    thumbnail: string;
    link: string;
    heroImage: string;
    duration: string;
    format: string;
    seats: string;
    longDescription: string;
    highlights: string[];
    whoIsItFor: string;
}

export const MENTORSHIPS: MentorshipProgram[] = [
    {
        slug: "1-percent-gita",
        title: "1% Gita",
        description: "Break free from the chains of habit. A guided program to reclaim your freedom.",
        category: "Reform",
        thumbnail: "/images/1-gita.png",
        link: "/mentorship/1-percent-gita",
        heroImage: "/images/1-gita.png",
        duration: "12 Weeks",
        format: "Live Sessions + Self-Paced",
        seats: "Limited to 30",
        longDescription: "The 1% Gita program is built on a simple but profound premise — improving just 1% every day compounds into total transformation. Rooted in the timeless wisdom of the Bhagavad Gita, this mentorship takes you through a structured journey of self-inquiry, discipline, and conscious action. Each week focuses on a key teaching from the Gita, translated into a practical daily discipline. You will face your habits head-on, understand the psychology behind inaction, and build unshakeable routines that align with your highest self. This is not a passive reading course — it is a living practice.",
        highlights: [
            "Weekly live sessions with mentor Q&A",
            "Daily Gita verse study with reflection prompts",
            "Habit-tracking framework based on Vedic principles",
            "Peer accountability circles of 5",
            "Access to recorded session archive",
        ],
        whoIsItFor: "Anyone feeling stuck, lacking clarity, or struggling to break free from repeated patterns. Whether you're a student, professional, or spiritual seeker — if you're ready for radical self-honesty, this is for you.",
    },
    {
        slug: "missing-link",
        title: "Missing Link",
        description: "The Art & Science of Rising Early. Master your mornings, master your life.",
        category: "Discipline",
        thumbnail: "/gellery-img/gallery-img-5.png",
        link: "/mentorship/missing-link",
        heroImage: "/gellery-img/gallery-img-5.png",
        duration: "6 Weeks",
        format: "Cohort-Based Live Program",
        seats: "Limited to 20",
        longDescription: "Why do the world's highest performers — monks, athletes, scientists — all guard their mornings with fierce intention? The Missing Link program answers this question through both ancient wisdom and modern neuroscience. We study Brahma Muhurta (the sacred pre-dawn hours) alongside circadian biology to design a morning architecture that works for your life. This cohort-based program runs for 6 weeks with live accountability check-ins, a community of like-minded practitioners, and a mentor-designed morning blueprint tailored to your goals. By Week 3, you'll understand your own chronobiology. By Week 6, rising early will feel natural — even something you look forward to.",
        highlights: [
            "Personal chronotype assessment",
            "Daily sunrise accountability check-in",
            "Vedic morning ritual design workshop",
            "Sleep optimization module",
            "Private community access for 3 months post-program",
        ],
        whoIsItFor: "Night owls who want to become early risers. Professionals who feel they never have enough time. Anyone who has tried to build a morning routine and failed — and wants to understand why.",
    },
    {
        slug: "soulful-sunday-sessions",
        title: "Soulful Sunday Sessions",
        description: "Vedic wisdom on Brahmacarya. Harnessing vital energy for higher purpose.",
        category: "Lifestyle",
        thumbnail: "/gellery-img/gallery-img-2.webp",
        link: "/mentorship/soulful-sunday-sessions",
        heroImage: "/gellery-img/gallery-img-2.webp",
        duration: "Ongoing Monthly",
        format: "Weekly Sunday Live Sessions",
        seats: "Open Enrollment",
        longDescription: "Every Sunday, a space opens for something rare — deep, honest, guided conversation about the ancient principle of Brahmacarya. Far from just celibacy, Brahmacarya is the art of directing vital energy (prana) toward creativity, clarity, and higher consciousness. In these weekly sessions, we explore what drains us and what restores us — through scripture, stories, science, and open dialogue. There is no fixed end date. Members join, participate at their own pace, and return whenever they need grounding. Think of it as a weekly reset for the soul. Each session covers a different theme: energy management, digital Brahmacarya, relationships, diet, and more.",
        highlights: [
            "Live Sunday sessions every week, 90 minutes",
            "Monthly theme-based deep dives",
            "Session recordings for members",
            "Open discussion forum between sessions",
            "Guest speakers: practitioners, doctors, monks",
        ],
        whoIsItFor: "Anyone curious about living with more intention, less reactivity, and greater energy. Those interested in Ayurveda, yoga, or Vedic lifestyle. Men and women seeking to understand and harness their vital energy.",
    },
];
