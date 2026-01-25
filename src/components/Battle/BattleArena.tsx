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
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-danger/20 p-3 rounded-xl border border-danger/20 shadow-lg shadow-danger/10">
                    <Swords className="text-danger" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white font-heading">Battle Arena</h1>
                    <p className="text-gray-400">View active conflicts and war history across the empire.</p>
                </div>
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

                                    <div className="flex justify-between items-center relative z-10">
                                        {/* Attacker */}
                                        <div className="text-center">
                                            <div className="w-12 h-12 rounded-full bg-danger/20 flex items-center justify-center mx-auto mb-2 border border-danger/50">
                                                <Swords className="text-danger" size={20} />
                                            </div>
                                            <p className="text-sm font-bold text-white font-mono">
                                                {battle.attacker_wallet.slice(0, 4)}...{battle.attacker_wallet.slice(-4)}
                                            </p>
                                            <p className="text-[10px] text-danger uppercase tracking-wider">Attacker</p>
                                        </div>

                                        {/* VS */}
                                        <div className="flex flex-col items-center px-4">
                                            <span className="text-2xl font-black text-white/20 italic">VS</span>
                                            <div className="mt-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                                                <MapPin size={12} className="text-gray-400" />
                                                <span className="text-xs font-mono text-gray-300">
                                                    Territory ({battle.territory?.x_coordinate}, {battle.territory?.y_coordinate})
                                                </span>
                                            </div>
                                        </div>

                                        {/* Defender */}
                                        <div className="text-center">
                                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-2 border border-blue-500/50">
                                                <Shield className="text-blue-400" size={20} />
                                            </div>
                                            <p className="text-sm font-bold text-white font-mono">
                                                {battle.defender_wallet.slice(0, 4)}...{battle.defender_wallet.slice(-4)}
                                            </p>
                                            <p className="text-[10px] text-blue-400 uppercase tracking-wider">Defender</p>
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
