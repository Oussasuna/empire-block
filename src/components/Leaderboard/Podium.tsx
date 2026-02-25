'use client';

import { motion } from 'framer-motion';
import { Crown, Trophy, Medal, Star } from 'lucide-react';
import { LeaderboardEntry } from '@/hooks/useLeaderboard';

interface PodiumProps {
    topThree: LeaderboardEntry[];
}

export default function Podium({ topThree }: PodiumProps) {
    if (topThree.length < 3) return null;

    const [first, second, third] = topThree;

    const PodiumCard = ({ entry, rank, height, color, icon, delay, shadow }: any) => (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: 'spring', damping: 20, stiffness: 100 }}
            className={`relative flex flex-col items-center group mb-4 order-${rank === 1 ? '2' : rank === 2 ? '1' : '3'}`}
        >
            {/* Avatar / Crown info */}
            <div className="relative mb-8 pt-4">
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className={`w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-gradient-to-br ${color} p-1 shadow-2xl relative z-10`}
                >
                    <div className="w-full h-full bg-[#0B0B15] rounded-[1.8rem] flex items-center justify-center text-3xl font-black text-white border border-white/10 shadow-inner">
                        {entry.username ? entry.username[0] : entry.wallet_address[0]}
                    </div>
                    {/* Pulsing Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-[1.8rem] blur-xl opacity-30 animate-pulse`} />
                </motion.div>

                <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 transition-all duration-500 group-hover:-translate-y-4 group-hover:scale-125">
                    {icon}
                </div>

                {/* Rank Badge */}
                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full bg-gradient-to-b ${color} border border-[#050510] shadow-lg`}>
                    <span className="text-xs font-black text-[#050510] uppercase tracking-tighter">Rank #{rank}</span>
                </div>
            </div>

            {/* Podium Base */}
            <div className={`
                ${height} w-32 md:w-44 bg-gradient-to-b from-white/10 to-transparent rounded-t-[2.5rem] border-t border-x border-white/10 
                flex flex-col items-center pt-10 px-6 text-center group-hover:bg-white/15 transition-all duration-500 relative
                overflow-hidden backdrop-blur-md shadow-${shadow}
            `}>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.03]" />
                <p className="relative z-10 text-white font-black text-sm md:text-base mb-2 truncate w-full tracking-tight">{entry.username || "Emperor"}</p>
                <div className="relative z-10 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5 mb-4">
                    <Star size={10} className="text-yellow-400" />
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{entry.total_territories}</p>
                </div>

                <div className="mt-auto pb-6 relative z-10">
                    <span className="text-5xl font-black text-white/5 tracking-tighter italic">#{rank}</span>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="flex items-end justify-center gap-4 md:gap-12 mb-20 pt-16 relative">
            <PodiumCard
                entry={second}
                rank={2}
                height="h-48 md:h-56"
                color="from-slate-300 to-slate-500"
                icon={<Trophy className="text-slate-400 drop-shadow-[0_0_15px_rgba(148,163,184,0.4)]" size={40} />}
                delay={0.2}
                shadow="xl"
            />
            <PodiumCard
                entry={first}
                rank={1}
                height="h-64 md:h-80"
                color="from-yellow-300 to-yellow-600"
                icon={<Crown className="text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.6)]" size={60} />}
                delay={0}
                shadow="2xl"
            />
            <PodiumCard
                entry={third}
                rank={3}
                height="h-36 md:h-44"
                color="from-orange-500 to-orange-800"
                icon={<Medal className="text-orange-600 drop-shadow-[0_0_15px_rgba(194,65,12,0.4)]" size={40} />}
                delay={0.4}
                shadow="lg"
            />
        </div>
    );
}
