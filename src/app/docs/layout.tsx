import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Empire Blocks - Game Guide',
    description: 'Everything you need to know about conquering the 50×50 grid, battling for territory, and earning rewards.',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
