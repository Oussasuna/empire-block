'use client';

import { motion } from 'framer-motion';
import { Users, Crown, TrendingUp, Sparkles } from 'lucide-react';
import { LeaderboardEntry } from '@/hooks/useLeaderboard';

interface StatsCardsProps {
    topPlayer: LeaderboardEntry | undefined;
}

export default function StatsCards({ topPlayer }: StatsCardsProps) {
    const stats = [
        {
            label: 'Top Emperor',
            value: topPlayer?.username || (topPlayer?.wallet_address ? `${topPlayer.wallet_address.slice(0, 6)}...` : '---'),
            icon: <Crown size={22} className="text-yellow-400" />,
            description: 'Rank #1 in influence',
            glow: 'rgba(234,179,8,0.1)'
        },
        {
            label: 'Most Territories',
            value: topPlayer?.total_territories || '0',
            icon: <Sparkles size={22} className="text-cyan-400" />,
            description: 'Dominating the grid',
            glow: 'rgba(6,182,212,0.1)'
        },
        {
            label: 'Highest Revenue',
            value: topPlayer ? `${topPlayer.total_revenue} SOL` : '0 SOL',
            icon: <TrendingUp size={22} className="text-emerald-400" />,
            description: 'Top earner all-time',
            glow: 'rgba(16,185,129,0.1)'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative">
            {stats.map((stat, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="relative bg-white/5 border border-white/10 p-8 rounded-[2.5rem] group hover:border-white/20 transition-all duration-500 cursor-default overflow-hidden backdrop-blur-3xl shadow-2xl"
                >
                    {/* Background Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                        style={{ background: `radial-gradient(circle at top right, ${stat.glow}, transparent)` }} />

                    <div className="relative z-10">
                        <div className="flex items-center gap-5 mb-6">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500 shadow-inner">
                                {stat.icon}
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-0.5">{stat.label}</p>
                                <p className="text-xs text-gray-400 font-bold opacity-60">{stat.description}</p>
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <p className="text-3xl font-black text-white tracking-tighter group-hover:text-primary transition-colors duration-500 truncate max-w-full">
                                {stat.value}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
