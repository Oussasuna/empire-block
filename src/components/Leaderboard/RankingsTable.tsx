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
        <div className="w-full bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                            <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-gray-500">Rank</th>
                            <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-gray-500">Emperor</th>
                            <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Territories</th>
                            <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Empire Size</th>
                            <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Revenue</th>
                            <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">W/L</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((entry, idx) => {
                            const isUser = entry.wallet_address === currentWallet;
                            const isTop10 = entry.rank <= 10;

                            return (
                                <motion.tr
                                    key={entry.wallet_address}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className={`
                                        group border-b border-white/5 transition-colors cursor-default
                                        ${isUser ? 'bg-purple-900/20 border-l-4 border-l-purple-500' : 'hover:bg-white/5'}
                                    `}
                                >
                                    <td className="py-5 px-8">
                                        <div className={`
                                            w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs
                                            ${entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                                                entry.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                                                    entry.rank === 3 ? 'bg-orange-600/20 text-orange-500' :
                                                        'bg-white/5 text-gray-400'}
                                        `}>
                                            #{entry.rank}
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-sm font-black text-white group-hover:scale-110 transition-transform">
                                                {entry.username ? entry.username[0] : entry.wallet_address[0]}
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm leading-tight flex items-center gap-2">
                                                    {entry.username || entry.wallet_address}
                                                    {isUser && <span className="text-[10px] bg-purple-600 px-1.5 py-0.5 rounded text-white font-black">YOU</span>}
                                                </p>
                                                <p className="text-[10px] text-gray-500 font-mono tracking-tight lowercase">{entry.wallet_address}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8 text-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 font-bold text-sm">
                                            <MapPin size={14} className="text-cyan-400" />
                                            {entry.total_territories}
                                        </div>
                                    </td>
                                    <td className="py-5 px-8 text-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 font-bold text-sm">
                                            <Crown size={14} className="text-purple-400" />
                                            {entry.largest_empire}
                                        </div>
                                    </td>
                                    <td className="py-5 px-8 text-center">
                                        <div className="inline-flex items-center gap-1.5 font-black text-white">
                                            <TrendingUp size={14} className="text-emerald-400" />
                                            {entry.total_revenue} <span className="text-purple-400 text-[10px]">SOL</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="text-xs font-black text-white">
                                                <span className="text-emerald-400">{entry.battles_won}</span>
                                                <span className="mx-1 text-gray-600">/</span>
                                                <span className="text-red-400">{entry.battles_lost}</span>
                                            </div>
                                            <div className="w-16 h-1 bg-white/5 rounded-full mt-1.5 overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                                                    style={{ width: `${entry.win_rate}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
