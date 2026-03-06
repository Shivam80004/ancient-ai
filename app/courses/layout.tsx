import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Academy Courses',
    description: 'Transformative wisdom for every stage of your journey. Browse our diverse range of spiritual courses.',
    alternates: {
        canonical: '/courses',
    }
};

export default function CoursesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
