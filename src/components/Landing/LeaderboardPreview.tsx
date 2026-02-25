'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const LeaderboardPreview = () => {
    const topPlayers = [
        { rank: 1, name: 'EmpireKing', score: '2,450', avatar: '👑' },
        { rank: 2, name: 'SolMaster', score: '1,820', avatar: '🛡️' },
        { rank: 3, name: 'GridLord', score: '1,450', avatar: '⚔️' },
    ];

    return (
        <section className="py-24 bg-[#050510] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div>
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-xs font-bold text-primary uppercase tracking-[0.4em] mb-4 block"
                        >
                            Global Rankings
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-black text-white"
                        >
                            Top <span className="text-gradient-primary">Emperors</span>
                        </motion.h2>
                    </div>

                    <Link href="/leaderboard" className="group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white hover:bg-white/10 transition-all">
                        Full Leaderboard
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {topPlayers.map((player, i) => (
                        <motion.div
                            key={player.rank}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                            className="glass-card p-8 relative group hover:border-primary/30 transition-all duration-500 cursor-pointer hover:shadow-[0_20px_40px_rgba(139,92,246,0.15)]"
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-2xl relative
                                    ${i === 0 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 shadow-yellow-500/10' :
                                        i === 1 ? 'bg-gray-300/20 text-gray-300 border border-gray-300/30 shadow-gray-300/10' :
                                            'bg-orange-500/20 text-orange-500 border border-orange-500/30 shadow-orange-500/10'}
                                `}>
                                    {player.avatar}
                                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[10px] font-black">
                                        #{player.rank}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tight">{player.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <Trophy size={14} className="text-primary" />
                                        <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">{player.score} PTS</span>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-4 right-8 opacity-0 group-hover:opacity-20 transition-opacity">
                                <Crown size={64} className="text-white" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
