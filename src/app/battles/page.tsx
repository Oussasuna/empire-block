import BattleArena from '@/components/Battle/BattleArena';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Battle Arena - Empire Blocks',
    description: 'Monitor active battles and war history.',
};

export default function BattlesPage() {
    return (
        <div className="min-h-screen pt-4 pb-20">
            <BattleArena />
        </div>
    );
}
