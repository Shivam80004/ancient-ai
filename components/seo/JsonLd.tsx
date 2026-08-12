import React from "react";

/** Renders a JSON-LD structured-data script. Invisible; affects SEO only. */
export function JsonLd({ data }: { data: object | object[] }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

export default JsonLd;
