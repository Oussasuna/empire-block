'use client';

import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Tag, Activity } from 'lucide-react';
import { MarketStats as StatsType } from '@/hooks/useMarketplace';

interface MarketStatsProps {
    stats: StatsType | null;
}

export default function MarketStats({ stats }: MarketStatsProps) {
    const statItems = [
        {
            label: '24h Volume',
            value: stats ? `${stats.volume24h} SOL` : '...',
            icon: <TrendingUp size={20} className="text-purple-400" />,
            color: 'from-purple-500/10 to-transparent'
        },
        {
            label: 'Total Trades',
            value: stats ? stats.totalTrades.toLocaleString() : '...',
            icon: <Activity size={20} className="text-blue-400" />,
            color: 'from-blue-500/10 to-transparent'
        },
        {
            label: 'Avg Price',
            value: stats ? `${stats.avgPrice} SOL` : '...',
            icon: <BarChart3 size={20} className="text-cyan-400" />,
            color: 'from-cyan-500/10 to-transparent'
        },
        {
            label: 'Active Listings',
            value: stats ? stats.activeListings.toLocaleString() : '...',
            icon: <Tag size={20} className="text-emerald-400" />,
            color: 'from-emerald-500/10 to-transparent'
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statItems.map((item, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative group bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-white/20"
                >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                    <div className="relative flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                            {item.icon}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-xl font-black text-white tracking-tight">{item.value}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
