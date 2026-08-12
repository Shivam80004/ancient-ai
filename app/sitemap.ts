import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/config";
import { COURSES } from "@/lib/course-data";
import { MENTORSHIPS } from "@/lib/mentorship-data";
import { RESOURCES } from "@/lib/resources-data";
import { TRIPS_DATA } from "@/lib/trips-data";

// Served at /sitemap.xml. Static public routes + dynamic detail pages generated
// from the same data modules the pages themselves consume.
export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
        { path: "/", priority: 1.0, changeFrequency: "weekly" },
        { path: "/about", priority: 0.7, changeFrequency: "monthly" },
        { path: "/who-we-are", priority: 0.7, changeFrequency: "monthly" },
        { path: "/our-inspiration", priority: 0.6, changeFrequency: "monthly" },
        { path: "/courses", priority: 0.9, changeFrequency: "weekly" },
        { path: "/events-and-mentorship", priority: 0.9, changeFrequency: "weekly" },
        { path: "/free-resources", priority: 0.8, changeFrequency: "weekly" },
        { path: "/retreats", priority: 0.8, changeFrequency: "weekly" },
        { path: "/contact-us", priority: 0.5, changeFrequency: "yearly" },
        { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
        { path: "/terms-of-service", priority: 0.3, changeFrequency: "yearly" },
        { path: "/cookie-policy", priority: 0.3, changeFrequency: "yearly" },
    ];

    const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
        url: absoluteUrl(r.path),
        lastModified: now,
        changeFrequency: r.changeFrequency,
        priority: r.priority,
    }));

    const courseEntries: MetadataRoute.Sitemap = COURSES.map((c) => ({
        url: absoluteUrl(`/courses/${c.slug}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    const mentorshipEntries: MetadataRoute.Sitemap = MENTORSHIPS.map((m) => ({
        url: absoluteUrl(`/events-and-mentorship/${m.slug}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    const resourceEntries: MetadataRoute.Sitemap = RESOURCES.map((r) => ({
        url: absoluteUrl(`/free-resources/${r.slug}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
    }));

    const retreatEntries: MetadataRoute.Sitemap = Object.values(TRIPS_DATA).map((t) => ({
        url: absoluteUrl(`/retreats/${t.slug}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
    }));

    return [
        ...staticEntries,
        ...courseEntries,
        ...mentorshipEntries,
        ...resourceEntries,
        ...retreatEntries,
    ];
}
