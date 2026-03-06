import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Free Resources',
    description: 'Knowledge should be free. Access these tools, cheat sheets, and media to jumpstart your spiritual journey.',
    alternates: {
        canonical: '/free-resources',
    }
};

export default function FreeResourcesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
