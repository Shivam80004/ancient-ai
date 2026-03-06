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
    };
}

export default function TripLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
