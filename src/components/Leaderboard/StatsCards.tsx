'use client';

import { motion } from 'framer-motion';
import { Users, Crown, TrendingUp } from 'lucide-react';
import { LeaderboardEntry } from '@/hooks/useLeaderboard';

interface StatsCardsProps {
    topPlayer: LeaderboardEntry | undefined;
}

export default function StatsCards({ topPlayer }: StatsCardsProps) {
    const stats = [
        {
            label: 'Top Emperor',
            value: topPlayer?.username || topPlayer?.wallet_address || '---',
            icon: <Crown size={20} className="text-yellow-400" />,
            description: 'Rank #1 in influence'
        },
        {
            label: 'Most Territories',
            value: topPlayer?.total_territories || '0',
            icon: <Users size={20} className="text-cyan-400" />,
            description: 'Dominating the grid'
        },
        {
            label: 'Highest Revenue',
            value: topPlayer ? `${topPlayer.total_revenue} SOL` : '0 SOL',
            icon: <TrendingUp size={20} className="text-emerald-400" />,
            description: 'Top earner all-time'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/5 border border-white/10 p-6 rounded-3xl group hover:border-white/20 transition-all cursor-default"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                            {stat.icon}
                        </div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</p>
                    </div>
                    <p className="text-2xl font-black text-white mb-1 truncate">{stat.value}</p>
                    <p className="text-xs text-gray-500 font-semibold">{stat.description}</p>
                </motion.div>
            ))}
        </div>
    );
}
