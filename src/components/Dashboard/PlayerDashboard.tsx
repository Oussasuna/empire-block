'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { usePlayerStore } from '@/store/playerStore';
import { usePlayerTerritories } from '@/hooks/usePlayerTerritories';
import { motion } from 'framer-motion';
import { Crown, MapPin, Coins, TrendingUp, Swords, Wallet, Zap } from 'lucide-react';
import EmpireMap from './EmpireMap';


function StatCard({ icon, label, value, colorClass, accentClass }: any) {
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="stat-card glass-card-hover p-5 rounded-2xl relative overflow-hidden group cursor-pointer shadow-neon-hover"
        >
            {/* Animated glow background */}
            <div className={`absolute inset-0 bg-gradient-to-br from-${accentClass}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

            <div className="relative flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClass} shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
                    <p className="text-2xl font-black text-white tracking-tight">{value}</p>
                </div>
            </div>

            {/* Pulsing indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </motion.div>
    );
}

function TerritoryCard({ territory }: any) {
    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'corner':
                return {
                    color: 'text-yellow-400',
                    border: 'neon-border-accent',
                    glow: 'shadow-[0_0_10px_rgba(251,191,36,0.3)]',
                    dot: 'bg-yellow-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                };
            case 'capital':
                return {
                    color: 'text-red-400',
                    border: 'neon-border-primary',
                    glow: 'shadow-[0_0_10px_rgba(239,68,68,0.3)]',
                    dot: 'bg-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                };
            case 'border':
                return {
                    color: 'text-cyan-400',
                    border: 'neon-border-secondary',
                    glow: 'shadow-[0_0_10px_rgba(6,182,212,0.3)]',
                    dot: 'bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                };
            default:
                return {
                    color: 'text-gray-400',
                    border: '',
                    glow: '',
                    dot: 'bg-gray-500'
                };
        }
    };

    const styles = getTypeStyles(territory.block_type);

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: 8, scale: 1.02 }}
            className={`glass-card-hover rounded-xl p-4 transition-all flex items-center justify-between group ${styles.border} ${styles.glow}`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${styles.dot} animate-pulse-glow`} />
                <div>
                    <span className="text-white font-mono font-bold text-sm block">
                        <span className={styles.color}>({territory.x_coordinate}, {territory.y_coordinate})</span>
                    </span>
                    <span className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">
                        {territory.block_type}
                    </span>
                </div>
            </div>

            <div className="text-right">
                <div className="text-accent font-mono font-bold text-sm flex items-center gap-1">
                    <Zap size={12} className="text-accent" />
                    {territory.total_revenue_earned?.toFixed(3) || 0}
                </div>
                <div className="text-gray-600 text-[10px] uppercase tracking-wider">SOL</div>
            </div>
        </motion.div>
    );
}

export default function PlayerDashboard() {
    const { publicKey } = useWallet();
    const { player, loading } = usePlayerStore();
    const { territories, empires, isLoading } = usePlayerTerritories(publicKey?.toString());

    if (!publicKey) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gradient-to-br from-primary/20 to-secondary/10 p-8 rounded-full mb-6 animate-glow-rotate"
                >
                    <Wallet size={48} className="text-primary" />
                </motion.div>
                <h3 className="text-3xl font-black text-gradient-primary mb-3">Connect Wallet</h3>
                <p className="text-gray-400 max-w-xs text-sm">Access your empire dashboard to view stats and manage territories.</p>
            </div>
        );
    }

    if (loading || isLoading) {
        return (
            <div className="space-y-4 animate-fadeIn">
                <div className="h-24 glass-card rounded-2xl animate-shimmer"></div>
                <div className="h-48 glass-card rounded-2xl animate-shimmer"></div>
                <div className="h-64 glass-card rounded-2xl animate-shimmer"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center text-white font-black text-xl shadow-neon animate-glow-rotate">
                    {publicKey.toString().slice(0, 2)}
                </div>
                <div>
                    <h2 className="text-xl font-black text-gradient-primary">Your Empire</h2>
                    <p className="text-xs text-gray-500 font-mono tracking-wider">
                        {publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-6)}
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4">
                <StatCard
                    icon={<MapPin size={28} strokeWidth={2.5} />}
                    label="Territories"
                    value={player?.total_blocks_owned || 0}
                    colorClass="from-purple-500/20 to-purple-600/10"
                    accentClass="purple-500"
                />
                <StatCard
                    icon={<Crown size={28} strokeWidth={2.5} />}
                    label="Empires"
                    value={empires?.length || 0}
                    colorClass="from-yellow-500/20 to-yellow-600/10"
                    accentClass="yellow-500"
                />
                <StatCard
                    icon={<Coins size={28} strokeWidth={2.5} />}
                    label="Revenue"
                    value={`${(player?.total_revenue_earned || 0).toFixed(2)}`}
                    colorClass="from-green-500/20 to-emerald-600/10"
                    accentClass="green-500"
                />
                <StatCard
                    icon={<Swords size={28} strokeWidth={2.5} />}
                    label="Battles"
                    value={`${player?.battles_won || 0}W / ${player?.battles_lost || 0}L`}
                    colorClass="from-red-500/20 to-rose-600/10"
                    accentClass="red-500"
                />
            </div>



            {/* Empire Map */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-3xl p-6 border-2 neon-border-primary shadow-neon"
            >
                <h3 className="text-sm font-black text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-primary" />
                    <span className="text-gradient-primary">Map Visualization</span>
                </h3>
                <EmpireMap territories={territories || []} empires={empires || []} />
            </motion.div>

            {/* Territory List */}
            <div className="space-y-4">
                <h3 className="text-sm font-black text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <Crown size={18} className="text-accent" />
                    <span className="text-gradient-accent">Holdings</span>
                </h3>

                {territories && territories.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2">
                        {territories.map((territory, idx) => (
                            <motion.div
                                key={territory.territory_id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <TerritoryCard territory={territory} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12 glass-card rounded-2xl border-2 border-dashed neon-border-secondary"
                    >
                        <MapPin size={48} className="mx-auto mb-4 text-gray-600" />
                        <p className="text-gray-400 text-sm mb-3 font-semibold">No territories owned</p>
                        <button className="text-primary text-xs font-bold hover:underline transition-all hover:scale-105">
                            Start Minting on Grid →
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
