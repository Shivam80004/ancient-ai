// Single source of truth for SEO / site-identity strings.
// Non-visual: consumed only by metadata, robots, sitemap and manifest.

/** Canonical production origin. Override per-environment via NEXT_PUBLIC_SITE_URL.
 *  Falls back to the same default already used in app/layout.tsx so behaviour
 *  is unchanged until the env var is set. */
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://ancientai.in/"
).replace(/\/$/, "");

export const SITE_NAME = "Ancient AI Academy";
export const SITE_DESCRIPTION =
    "A better human experience. Strengthening the mind, body, and soul through timeless wisdom, courses, mentorship and retreats.";

/** Default social share image (relative to the site origin). */
export const DEFAULT_OG_IMAGE = "/logo-plain.png";

/** Build an absolute canonical URL for a given path. */
export function absoluteUrl(path = "/"): string {
    const clean = path.startsWith("/") ? path : `/${path}`;
    return `${SITE_URL}${clean}`;
}

/** Route prefixes that must never be indexed (private / auth / API areas). */
export const NOINDEX_PREFIXES = [
    "/dashboard",
    "/admin",
    "/auth",
    "/api",
    "/onboarding",
    "/login",
    "/signup",
    "/google-login",
    "/email-password",
];
