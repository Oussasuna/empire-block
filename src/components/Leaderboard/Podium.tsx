'use client';

import { motion } from 'framer-motion';
import { Crown, Trophy, Medal } from 'lucide-react';
import { LeaderboardEntry } from '@/hooks/useLeaderboard';

interface PodiumProps {
    topThree: LeaderboardEntry[];
}

export default function Podium({ topThree }: PodiumProps) {
    if (topThree.length < 3) return null;

    const [first, second, third] = topThree;

    const PodiumCard = ({ entry, rank, height, color, icon }: any) => (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rank * 0.2, type: 'spring' }}
            className={`relative flex flex-col items-center group mb-4 order-${rank === 1 ? '2' : rank === 2 ? '1' : '3'}`}
        >
            {/* Avatar / Crown info */}
            <div className="relative mb-6">
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${color} p-1 shadow-2xl relative z-10 overflow-hidden`}>
                    <div className="w-full h-full bg-[#0f1624] rounded-full flex items-center justify-center text-2xl font-black text-white">
                        {entry.username ? entry.username[0] : entry.wallet_address[0]}
                    </div>
                </div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 group-hover:-translate-y-2 transition-transform duration-300">
                    {icon}
                </div>
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-t ${color} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`} />
            </div>

            {/* Podium Base */}
            <div className={`
                ${height} w-28 md:w-36 bg-gradient-to-b from-white/10 to-transparent rounded-t-3xl border-t border-x border-white/10 
                flex flex-col items-center pt-6 px-4 text-center group-hover:bg-white/15 transition-all duration-300
            `}>
                <p className="text-white font-black text-sm mb-1 truncate w-full">{entry.username || entry.wallet_address}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{entry.total_territories} TERR</p>
                <div className="mt-auto pb-4">
                    <span className="text-2xl font-black text-white opacity-20">#{rank}</span>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="flex items-end justify-center gap-2 md:gap-6 mb-16 pt-12">
            <PodiumCard
                entry={second}
                rank={2}
                height="h-40 md:h-48"
                color="from-gray-400 to-gray-600"
                icon={<Trophy className="text-gray-400" size={32} />}
            />
            <PodiumCard
                entry={first}
                rank={1}
                height="h-56 md:h-64"
                color="from-yellow-400 to-yellow-600"
                icon={<Crown className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" size={48} />}
            />
            <PodiumCard
                entry={third}
                rank={3}
                height="h-32 md:h-40"
                color="from-orange-600 to-orange-800"
                icon={<Medal className="text-orange-500" size={32} />}
            />
        </div>
    );
}
