import BattleArena from '@/components/Battle/BattleArena';
import { Metadata } from 'next';
import { LandingNavbar } from '@/components/Landing/Navbar';
import { LandingFooter } from '@/components/Landing/CTABanner';

export const metadata: Metadata = {
    title: 'Battle Arena - Empire Blocks',
    description: 'Monitor active battles and war history.',
};

export default function BattlesPage() {
    return (
        <div className="min-h-screen bg-[#050510] text-white selection:bg-purple-500/30">
            <LandingNavbar />
            <main className="py-12">
                <BattleArena />
            </main>
            <LandingFooter />
        </div>
    );
}
