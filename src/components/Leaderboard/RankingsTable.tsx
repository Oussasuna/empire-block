'use client';

import { motion } from 'framer-motion';
import { Crown, MapPin, Swords, TrendingUp } from 'lucide-react';
import { LeaderboardEntry } from '@/hooks/useLeaderboard';

interface RankingsTableProps {
    data: LeaderboardEntry[];
    currentWallet?: string;
}

export default function RankingsTable({ data, currentWallet }: RankingsTableProps) {
    return (
        <div className="w-full bg-black/40 rounded-[32px] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Rank</th>
                            <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Emperor</th>
                            <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 text-center">Territories</th>
                            <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 text-center">Empire Size</th>
                            <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 text-center">Revenue</th>
                            <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 text-center">War Records</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {data.map((entry, idx) => {
                            const isUser = entry.wallet_address === currentWallet;

                            return (
                                <motion.tr
                                    key={entry.wallet_address}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.04, ease: "easeOut" }}
                                    className={`
                                        group transition-all duration-300 cursor-default
                                        ${isUser ? 'bg-primary/10 border-l-4 border-l-primary relative z-10' : 'hover:bg-white/[0.04]'}
                                    `}
                                >
                                    <td className="py-6 px-8">
                                        <div className={`
                                            w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs transition-transform group-hover:scale-110 duration-300
                                            ${entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]' :
                                                entry.rank === 2 ? 'bg-gray-400/20 text-gray-300 border border-gray-400/30' :
                                                    entry.rank === 3 ? 'bg-orange-600/20 text-orange-500 border border-orange-600/30' :
                                                        'bg-white/5 text-gray-400 border border-white/5'}
                                        `}>
                                            {entry.rank}
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-sm font-black text-white group-hover:rotate-6 transition-all duration-500 border border-white/5 shadow-inner">
                                                    {entry.username ? entry.username[0] : entry.wallet_address[0]}
                                                </div>
                                                {entry.rank === 1 && (
                                                    <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1 border-2 border-[#050510] shadow-lg">
                                                        <Crown size={10} className="text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p className="text-white font-black text-sm tracking-tight group-hover:text-primary transition-colors">
                                                        {entry.username || "Anonymous Emperor"}
                                                    </p>
                                                    {isUser && (
                                                        <span className="text-[9px] bg-primary/20 border border-primary/30 px-2 py-0.5 rounded-full text-primary font-black uppercase tracking-widest whitespace-nowrap">
                                                            You
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-gray-500 font-mono tracking-tight opacity-70 truncate max-w-[120px]">
                                                    {entry.wallet_address}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/[0.03] border border-cyan-500/10 font-bold text-sm text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                                            <MapPin size={14} />
                                            {entry.total_territories}
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/[0.03] border border-purple-500/10 font-bold text-sm text-purple-400 group-hover:bg-purple-500/10 transition-colors">
                                            <Crown size={14} />
                                            {entry.largest_empire}
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="inline-flex items-center gap-1.5 font-black text-white text-base">
                                                <TrendingUp size={16} className="text-emerald-400" />
                                                {entry.total_revenue}
                                            </div>
                                            <span className="text-primary text-[9px] font-black uppercase tracking-widest opacity-60">SOL Earned</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-center">
                                        <div className="flex flex-col items-center min-w-[100px]">
                                            <div className="text-xs font-black text-white mb-2 flex items-center gap-3">
                                                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {entry.battles_won}</span>
                                                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {entry.battles_lost}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${entry.win_rate}%` }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                                                />
                                            </div>
                                            <span className="text-[9px] font-bold text-gray-500 mt-1.5 uppercase tracking-tighter">{entry.win_rate}% Win Rate</span>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {data.length === 0 && (
                <div className="py-20 text-center">
                    <div className="mb-6 opacity-20">
                        <Swords size={60} className="mx-auto text-gray-400" />
                    </div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest">No emperors ranked yet</p>
                </div>
            )}
        </div>
    );
}
