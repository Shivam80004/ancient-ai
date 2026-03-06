export interface FreeResource {
    slug: string;
    title: string;
    description: string;
    category: string;
    image: string; // Used for grid thumbnail
    heroImage: string; // Used for inner page hero
    type: 'pdf' | 'audio' | 'video' | 'article' | 'link';
    externalLink: string; // The actual link to download/view the resource
    className: string; // Grid styling

    // Detailed Inner Page Fields
    format: string;
    length: string;
    longDescription: string;
    highlights: string[];
    whoIsItFor: string;
    ctaText: string;
}

export const RESOURCES: FreeResource[] = [
    {
        title: "Gita Cheat Sheet",
        slug: "gita-cheat-sheet",
        description: "A crisp, visual reference to the Bhagavad Gita's most powerful verses — distilled so you can carry the wisdom anywhere.",
        category: "PDF Download",
        image: "/gellery-img/gallery-img-5.png",
        heroImage: "/gellery-img/gallery-img-5.png",
        type: "pdf",
        externalLink: "#", // Replace with real link when available
        className: "md:col-span-2 md:row-span-1",
        format: "Digital PDF",
        length: "1 Page Reference Guide",
        ctaText: "Download PDF",
        longDescription: "The Bhagavad Gita contains profound wisdom, but in our fast-paced lives, it can be hard to recall exactly what we need when challenges arise. This beautifully designed, one-page cheat sheet acts as a quick-reference guide. It breaks down the most essential shlokas (verses) by theme — addressing anxiety, purpose, decision-making, and resilience. Whether you keep it on your desk, save it on your phone, or print it for your journal, it ensures that ancient wisdom is always just a glance away.",
        highlights: [
            "Quick-reference for 20+ thematic life situations",
            "Sanskrit verse alongside simplified English translation",
            "High-resolution file suitable for printing",
            "Perfect addition to a daily journaling or meditation habit"
        ],
        whoIsItFor: "Busy professionals, students, and spiritual seekers who want quick, actionable wisdom from the Gita without having to read through hundreds of pages every day.",
    },
    {
        title: "Kirtan Playlist",
        slug: "kirtan-playlist",
        description: "Carefully curated soul-stirring kirtans from HKM Mumbai — perfect for meditation, morning sadhana, or anytime you need to reset.",
        category: "Audio",
        image: "/gellery-img/gallery-img-3.jpg",
        heroImage: "/gellery-img/gallery-img-3.jpg",
        type: "audio",
        externalLink: "https://www.youtube.com/@HKMMumbai",
        className: "md:col-span-2 md:row-span-1",
        format: "YouTube Audio Playlist",
        length: "2+ Hours",
        ctaText: "Listen on YouTube",
        longDescription: "Sound is one of the most powerful mediums for consciousness alteration. Kirtan, the ancient practice of musical mantra chanting, has been used for millennia to bypass the analytical mind and anchor the soul in peace. This carefully curated playlist features soul-stirring recordings directly from HKM Mumbai. It progresses from slow, meditative chants suitable for deep morning sadhana, building up to ecstatic, high-energy kirtans that elevate your state of mind. Use it as background music for deep work, driving, or dedicated meditation.",
        highlights: [
            "High-quality audio recordings from renowned practitioners",
            "Curated progression from meditative to ecstatic",
            "Features traditional Vedic instruments (Mridanga, Kartals)",
            "Aids in focus, anxiety reduction, and spiritual alignment"
        ],
        whoIsItFor: "Anyone looking for powerful, spiritually uplifting background music or a dedicated auditory focus for mantra meditation and daily sadhana."
    },
    {
        title: "Bhagavad Gita PDF",
        slug: "bhagavad-gita-pdf",
        description: "The complete Bhagavad Gita As It Is by Srila Prabhupada — free to read, study, and share. The most translated spiritual text in history.",
        category: "PDF Download",
        image: "/images/1-gita.png",
        heroImage: "/images/1-gita.png",
        type: "pdf",
        externalLink: "https://www.vedabase.com/en/bg",
        className: "md:col-span-2 md:row-span-1",
        format: "E-Text / PDF Portal",
        length: "700 Verses + Purports",
        ctaText: "Read Online",
        longDescription: "The Bhagavad Gita is the foundational text of Ancient Indian spirituality, offering a timeless framework for duty, action, and devotion. 'Bhagavad Gita As It Is' by A.C. Bhaktivedanta Swami Prabhupada is renowned worldwide for its authenticity, presenting the teachings of Lord Krishna without dilution or speculative interpretation. This digital resource gives you complete access to the original Sanskrit verses, transliterations, word-for-word translations, and profound purports (explanations) that make the text deeply applicable to modern life challenges.",
        highlights: [
            "Complete text of all 18 Chapters and 700 verses",
            "Original Sanskrit text with English transliteration",
            "Word-for-word translations for serious students",
            "Extensive purports explaining practical application",
            "Fully searchable digital format"
        ],
        whoIsItFor: "Serious seekers of truth, philosophy students, and anyone experiencing a 'crisis of purpose' looking for the ultimate manual on human life and consciousness."
    },
    {
        title: "Mini Documentary Series",
        slug: "mini-documentary-series",
        description: "Short, impactful films on Vedic philosophy, monk life, and spiritual transformation — produced by HKM Mumbai.",
        category: "Video Series",
        image: "/gellery-img/gallery-img-2.webp",
        heroImage: "/gellery-img/gallery-img-2.webp",
        type: "video",
        externalLink: "https://www.youtube.com/@HKMMumbai",
        className: "md:col-span-2 md:row-span-1",
        format: "YouTube Video Series",
        length: "Multi-part Series",
        ctaText: "Watch the Series",
        longDescription: "Step behind the scenes and explore the living tradition of Vedic culture in the modern world. This mini-documentary series provides an intimate look at the lives of urban monks, the science of temple architecture, the philosophy of conscious food distribution (prasadam), and real-life stories of profound spiritual transformation. Filmed with cinematic quality, these short films are designed to be both visually stunning and intellectually stimulating, challenging modern preconceptions about spirituality and ancient Indian wisdom.",
        highlights: [
            "Cinematic, high-quality documentary production",
            "Exclusive interviews with senior practitioners and monks",
            "Exploration of applied Vedic philosophy in urban settings",
            "Bite-sized episodes perfect for daily inspiration"
        ],
        whoIsItFor: "Visual learners, documentary enthusiasts, and those curious about how ancient spiritual practices are practically applied by communities in the 21st century."
    },
];
