export interface Course {
    title: string;
    description: string;
    category: string;
    image: string; // Used in CoursesCarousel
    slug: string;
    // Detail page fields
    heroImage: string;
    thumbnail: string;
    duration: string;
    format: string;
    level: string;
    longDescription: string;
    whoIsItFor: string;
    highlights: string[];
}

const defaultDetails = {
    duration: "4 Weeks",
    format: "Online & Offline",
    level: "Intermediate",
    longDescription: "This comprehensive module is designed to help you navigate the complexities of life with clarity and purpose. Drawing from ancient texts and modern psychological insights, we explore the fundamental questions of existence.",
    whoIsItFor: "Seekers of knowledge, individuals looking for spiritual grounding, and anyone interested in the practical application of ancient wisdom in daily life.",
    highlights: [
        "Core principles of Vedic wisdom",
        "Practical mindfulness techniques",
        "Stress management strategies",
        "Leadership and decision making"
    ]
};

export const COURSES: Course[] = [
    {
        title: "Perfect Questions Perfect Answers",
        description: "A profound conversation exploring the deeper meaning of life.",
        category: "Book Study",
        image: "/images/courses/Perfect_questions_perfect_answers_2k_delpmaspu.png",
        slug: "perfect-questions-perfect-answers",
        heroImage: "/images/courses/Perfect_questions_perfect_answers_2k_delpmaspu.png",
        thumbnail: "/images/courses/Perfect_questions_perfect_answers_2k_delpmaspu.png",
        ...defaultDetails,
    },
    {
        title: "Beyond Birth & Death",
        description: "Insights into the journey of the soul and the process of reincarnation.",
        category: "Book Study",
        image: "/images/courses/Beyond_birth__death_2k_delpmaspu.png",
        slug: "beyond-birth-and-death",
        heroImage: "/images/courses/Beyond_birth__death_2k_delpmaspu.png",
        thumbnail: "/images/courses/Beyond_birth__death_2k_delpmaspu.png",
        ...defaultDetails,
    },
    {
        title: "The Science of Self-Realization",
        description: "Discover the timeless science of spiritual realization and consciousness.",
        category: "Book Study",
        image: "/images/courses/The_science_of_selfrealization_2k_delpmaspu.png",
        slug: "the-science-of-self-realization",
        heroImage: "/images/courses/The_science_of_selfrealization_2k_delpmaspu.png",
        thumbnail: "/images/courses/The_science_of_selfrealization_2k_delpmaspu.png",
        ...defaultDetails,
    },
    {
        title: "Raja-vidya: The King of Knowledge",
        description: "Explore the supreme knowledge of the Bhagavad-gita.",
        category: "Book Study",
        image: "/images/courses/raja-vidhya.jpg",
        slug: "raja-vidya-the-king-of-knowledge",
        heroImage: "/images/courses/raja-vidhya.jpg",
        thumbnail: "/images/courses/raja-vidhya.jpg",
        ...defaultDetails,
    },
    {
        title: "Life Comes from Life",
        description: "A scientific and philosophical discussion on the origins of life.",
        category: "Book Study",
        image: "/images/courses/reincarnation-928.jpg",
        slug: "life-comes-from-life",
        heroImage: "/images/courses/reincarnation-928.jpg",
        thumbnail: "/images/courses/reincarnation-928.jpg",
        ...defaultDetails,
    },
    {
        title: "Easy Journey to Other Planets",
        description: "Understanding the cosmos and spiritual realms through Vedic wisdom.",
        category: "Book Study",
        image: "/images/courses/Go_to_planets__2k_delpmaspu.png",
        slug: "easy-journey-to-other-planets",
        heroImage: "/images/courses/Go_to_planets__2k_delpmaspu.png",
        thumbnail: "/images/courses/Go_to_planets__2k_delpmaspu.png",
        ...defaultDetails,
    },
];
