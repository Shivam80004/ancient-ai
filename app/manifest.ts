import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo/config";

// Served at /manifest.webmanifest. Uses the existing /logo-plain.png asset.
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: SITE_NAME,
        short_name: "Ancient AI",
        description: SITE_DESCRIPTION,
        start_url: "/",
        display: "standalone",
        background_color: "#0A0A0A",
        theme_color: "#1A1614",
        icons: [
            {
                src: "/logo-plain.png",
                sizes: "any",
                type: "image/png",
            },
        ],
    };
}
