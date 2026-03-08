'use client';

import { useBattle } from '@/hooks/useBattle';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swords, Shield, History, MapPin, Loader2, Trophy } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function BattleArena() {
    const { activeBattles, history, fetchActiveBattles, fetchHistory, isLoading } = useBattle();
    const { publicKey } = useWallet();

    useEffect(() => {
        fetchActiveBattles();
        fetchHistory();
        // Poll for updates every 10 seconds
        const interval = setInterval(() => {
            fetchActiveBattles();
        }, 10000);
        return () => clearInterval(interval);
    }, [fetchActiveBattles, fetchHistory]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl relative">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-red-600/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex flex-col items-center mb-16 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 bg-danger/10 rounded-2xl flex items-center justify-center mb-6 border border-danger/20 shadow-[0_0_50px_rgba(239,68,68,0.15)] group hover:scale-110 transition-transform duration-300"
                >
                    <Swords className="text-danger group-hover:rotate-12 transition-transform" size={32} />
                </motion.div>
                <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-4 uppercase italic">
                    Battle<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Arena</span>
                </h1>
                <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs">
                    Conquer Territories <span className="text-gray-600 mx-2">•</span> Dominate the Grid
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Battles Column */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Shield className="text-accent" size={20} />
                        Active Conflicts
                        {isLoading && <Loader2 className="animate-spin text-gray-500 ml-2" size={16} />}
                    </h2>

                    {activeBattles.length > 0 ? (
                        <div className="grid gap-4">
                            {activeBattles.map((battle) => (
                                <motion.div
                                    key={battle.battle_id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-card p-6 rounded-xl border border-danger/20 bg-gradient-to-r from-danger/5 to-transparent relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                        <Swords size={100} />
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
                                        {/* Attacker */}
                                        <div className="text-center w-full sm:w-auto">
                                            <div className="w-12 h-12 rounded-full bg-danger/20 flex items-center justify-center mx-auto mb-2 border border-danger/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                                <Swords className="text-danger" size={20} />
                                            </div>
                                            <p className="text-sm font-bold text-white font-mono tracking-wider">
                                                {battle.attacker_wallet.slice(0, 4)}...{battle.attacker_wallet.slice(-4)}
                                            </p>
                                            <p className="text-[10px] text-danger uppercase font-black tracking-widest mt-1">Attacker</p>
                                        </div>

                                        {/* VS */}
                                        <div className="flex flex-row sm:flex-col items-center gap-4 sm:gap-2 px-4 w-full sm:w-auto justify-center">
                                            <div className="h-px w-8 sm:w-px sm:h-4 bg-white/10 hidden sm:block" />
                                            <span className="text-2xl md:text-3xl font-black text-white/20 italic">VS</span>
                                            <div className="mt-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2 shadow-inner">
                                                <MapPin size={12} className="text-primary" />
                                                <span className="text-[10px] md:text-xs font-mono text-gray-300 font-bold whitespace-nowrap">
                                                    ({battle.territory?.x_coordinate}, {battle.territory?.y_coordinate})
                                                </span>
                                            </div>
                                            <div className="h-px w-8 sm:w-px sm:h-4 bg-white/10 hidden sm:block" />
                                        </div>

                                        {/* Defender */}
                                        <div className="text-center w-full sm:w-auto">
                                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-2 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                                <Shield className="text-blue-400" size={20} />
                                            </div>
                                            <p className="text-sm font-bold text-white font-mono tracking-wider">
                                                {battle.defender_wallet.slice(0, 4)}...{battle.defender_wallet.slice(-4)}
                                            </p>
                                            <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">Defender</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-center">
                                        <span className="text-xs text-yellow-500 animate-pulse font-bold">
                                            ⚠️ BATTLE IN PROGRESS
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/5 border-dashed">
                            <Shield className="text-gray-600 mx-auto mb-4" size={48} />
                            <h3 className="text-xl font-bold text-gray-400">Peace Prevails</h3>
                            <p className="text-gray-600">No active battles at this moment.</p>
                        </div>
                    )}
                </div>

                {/* History Column */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <History className="text-gray-400" size={20} />
                        Recent History
                    </h2>

                    <div className="bg-black/20 rounded-xl p-4 border border-white/5 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                        {history.length > 0 ? (
                            history.map((battle) => (
                                <div key={battle.battle_id} className="border-b border-white/5 last:border-0 pb-3 last:pb-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs text-gray-500">
                                            {new Date(battle.started_at).toLocaleDateString()}
                                        </span>
                                        <div className="flex items-center gap-1 text-accent text-xs font-bold">
                                            <Trophy size={10} />
                                            <span>
                                                {battle.winner_wallet?.slice(0, 4)}...{battle.winner_wallet?.slice(-4)}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-300">
                                        <span className="text-white font-bold">{battle.attacker_wallet.slice(0, 4)}</span> attacked
                                        <span className="text-white font-bold mx-1">{battle.defender_wallet.slice(0, 4)}</span>
                                        at ({battle.territory?.x_coordinate}, {battle.territory?.y_coordinate})
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600 py-4 text-sm">No battle history recorded.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
