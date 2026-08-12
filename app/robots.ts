import type { MetadataRoute } from "next";
import { SITE_URL, NOINDEX_PREFIXES } from "@/lib/seo/config";

// Served at /robots.txt — tells crawlers what to index and where the sitemap is.
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: NOINDEX_PREFIXES.map((p) => `${p}/`),
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
