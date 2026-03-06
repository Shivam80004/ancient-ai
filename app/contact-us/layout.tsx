import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'We’d love to hear from you. Send us your thoughts and questions about Ancient AI Academy.',
    alternates: {
        canonical: '/contact-us',
    }
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
