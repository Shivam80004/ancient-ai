import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, DEFAULT_OG_IMAGE, absoluteUrl } from "./config";

export function organizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl(DEFAULT_OG_IMAGE),
        description: SITE_DESCRIPTION,
        sameAs: [] as string[],
    };
}

export function websiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
    };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: it.name,
            item: absoluteUrl(it.path),
        })),
    };
}

export function courseSchema(c: { title: string; description: string; slug: string; heroImage: string }) {
    return {
        "@context": "https://schema.org",
        "@type": "Course",
        name: c.title,
        description: c.description,
        url: absoluteUrl(`/courses/${c.slug}`),
        image: absoluteUrl(c.heroImage),
        provider: { "@type": "Organization", name: SITE_NAME, sameAs: SITE_URL },
    };
}

export function mentorshipSchema(m: { title: string; description: string; slug: string; heroImage: string }) {
    return {
        "@context": "https://schema.org",
        "@type": "EducationalOccupationalProgram",
        name: m.title,
        description: m.description,
        url: absoluteUrl(`/events-and-mentorship/${m.slug}`),
        image: absoluteUrl(m.heroImage),
        provider: { "@type": "Organization", name: SITE_NAME, sameAs: SITE_URL },
    };
}

export function resourceSchema(r: { title: string; description: string; slug: string; heroImage: string }) {
    return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: r.title,
        description: r.description,
        url: absoluteUrl(`/free-resources/${r.slug}`),
        image: absoluteUrl(r.heroImage),
        publisher: { "@type": "Organization", name: SITE_NAME, sameAs: SITE_URL },
    };
}

export function retreatSchema(t: { title: string; description: string; slug: string; image: string }) {
    return {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        name: t.title,
        description: t.description,
        url: absoluteUrl(`/retreats/${t.slug}`),
        image: absoluteUrl(t.image),
        provider: { "@type": "Organization", name: SITE_NAME, sameAs: SITE_URL },
    };
}
