import { TRIPS_DATA } from '@/lib/trips-data';
import type { Metadata } from 'next';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const trip = TRIPS_DATA[slug];

    if (!trip) return {};

    return {
        title: `${trip.title} — Ancient AI Retreats`,
        description: trip.description,
        alternates: { canonical: `/retreats/${trip.slug}` },
        openGraph: {
            title: `${trip.title} — Ancient AI Retreats`,
            description: trip.description,
            url: `/retreats/${trip.slug}`,
            type: "article",
            images: [{ url: trip.image }],
        },
        twitter: { card: "summary_large_image", title: trip.title, description: trip.description, images: [trip.image] },
    };
}

export default function TripLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
