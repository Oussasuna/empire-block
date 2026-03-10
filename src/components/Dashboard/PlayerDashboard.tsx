'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { usePlayerStore } from '@/store/playerStore';
import { useMintTerritory } from '@/hooks/useMintTerritory';
import { motion } from 'framer-motion';
import { Crown, MapPin, Coins, TrendingUp, Swords, Wallet, Zap, Sparkles, Tag } from 'lucide-react';
import EmpireMap from './EmpireMap';
import { usePlayerTerritories } from '@/hooks/usePlayerTerritories';
import { useGameProgram } from '../program/game';
import { useMarketplace } from '@/hooks/useMarketplace';
import ListLandModal from '../Marketplace/ListLandModal';
import { PublicKey } from '@solana/web3.js';
import { useState } from 'react';


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

function TerritoryCard({ territory, onList, onCancel }: any) {
    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'corner':
                return {
                    text: 'text-amber-400',
                    bg: 'bg-amber-400/10',
                    border: 'border-amber-400/20',
                    glow: 'group-hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]',
                    dot: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]',
                    gradient: 'from-amber-500/5 to-transparent'
                };
            case 'capital':
                return {
                    text: 'text-rose-400',
                    bg: 'bg-rose-400/10',
                    border: 'border-rose-400/20',
                    glow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]',
                    dot: 'bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]',
                    gradient: 'from-rose-500/5 to-transparent'
                };
            case 'border':
                return {
                    text: 'text-cyan-400',
                    bg: 'bg-cyan-400/10',
                    border: 'border-cyan-400/20',
                    glow: 'group-hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]',
                    dot: 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]',
                    gradient: 'from-cyan-500/5 to-transparent'
                };
            default:
                return {
                    text: 'text-purple-400',
                    bg: 'bg-purple-400/10',
                    border: 'border-purple-400/20',
                    glow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]',
                    dot: 'bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]',
                    gradient: 'from-purple-500/5 to-transparent'
                };
        }
    };

    const styles = getTypeStyles(territory.blockType);

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.01 }}
            className={`
                relative overflow-hidden rounded-2xl p-4 transition-all duration-300
                border bg-black/40 backdrop-blur-xl group
                ${styles.border} ${styles.glow}
            `}
        >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${styles.gradient} opacity-50`} />

            <div className="relative flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                    {/* Icon / Dot area */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${styles.border} ${styles.bg}`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${styles.dot} animate-pulse-glow`} />
                    </div>

                    {/* Info */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-mono font-black text-sm tracking-tight">
                                <span className="opacity-40">POS</span>
                                <span className={styles.text}> [{territory.x}, {territory.y}]</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black">
                                {territory.blockType}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                                Lvl {territory.level}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {territory.isListed ? (
                        <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                            <Tag size={10} />
                            Listed
                        </span>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onList(territory);
                            }}
                            className="px-4 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-emerald-500/20 transition-all flex items-center gap-1.5"
                        >
                            <Tag size={10} />
                            List for Sale
                        </button>
                    )}

                    <div className="flex items-center gap-1.5 ml-2">
                        <MapPin size={10} className={styles.text} />
                        <span className="text-[10px] font-mono font-bold text-gray-500">
                            #{territory.id}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function PlayerDashboard() {
    const { publicKey } = useWallet();
    const { player, loading } = usePlayerStore();
    const { territories, empires, isLoading } = usePlayerTerritories(publicKey?.toString());
    const { mintTerritory, isMinting } = useMintTerritory();
    const { allUserLands } = useGameProgram();
    const { cancelList, listings } = useMarketplace();

    const [listModal, setListModal] = useState<{
        isOpen: boolean;
        landPubkey: PublicKey | null;
        landId: string;
        coordinates: { x: string; y: string };
        currentPrice?: number;
        isEditing: boolean;
    }>({
        isOpen: false,
        landPubkey: null,
        landId: '',
        coordinates: { x: '', y: '' },
        isEditing: false
    });

    const handleListRequest = (territory: any) => {
        const activeListing = listings.find(l => l.territory_id === territory.id);

        setListModal({
            isOpen: true,
            landPubkey: territory._rawPublicKey,
            landId: territory.id,
            coordinates: { x: territory.x, y: territory.y },
            currentPrice: activeListing?.price,
            isEditing: !!territory.isListed
        });
    };

    const handleCancelListing = async (territory: any) => {
        if (!territory._rawPublicKey) return;
        await cancelList(territory._rawPublicKey);
    };

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



            {/* Mint Banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-3xl p-6 border-2 neon-border-secondary shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden group"
            >
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent opacity-50"></div>
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/20 blur-[50px] rounded-full group-hover:bg-cyan-400/30 transition-colors duration-500"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        <Sparkles size={32} className="text-white" />
                    </div>

                    <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
                        Expand Your Empire
                    </h3>

                    <p className="text-xs md:text-sm text-gray-400 max-w-[280px] mx-auto mb-6">
                        Claim unexplored coordinates on the grid. Build your territory and climb the leaderboards.
                    </p>

                    <div className="flex gap-4 mb-6">
                        <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1 font-bold">Cost</span>
                            <span className="text-sm font-mono font-bold text-cyan-400">0.01 SOL</span>
                        </div>
                        <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1 font-bold">Network</span>
                            <span className="text-sm font-mono font-bold text-purple-400">Devnet</span>
                        </div>
                    </div>

                    <button
                        onClick={() => mintTerritory()}
                        disabled={isMinting}
                        className={`
                            relative w-full py-4 rounded-xl font-black tracking-widest uppercase transition-all duration-300 overflow-hidden
                            ${isMinting
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-2 border-gray-700'
                                : 'bg-transparent text-white border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:bg-cyan-500/10'}
                        `}
                    >
                        {/* Button Glow inside */}
                        {!isMinting && (
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-transparent group-hover:translate-x-full transition-transform duration-1000 -translate-x-full"></div>
                        )}

                        <div className="relative z-10 flex items-center justify-center gap-2">
                            {isMinting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
                                    <span>Forging Deed...</span>
                                </>
                            ) : (
                                <>
                                    <MapPin size={18} className="text-cyan-400" />
                                    <span>Mint Territory</span>
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </motion.div>


            {/* Territory List */}
            <div className="space-y-4">
                <h3 className="text-sm font-black text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <Crown size={18} className="text-accent" />
                    <span className="text-gradient-accent">Holdings</span>
                </h3>

                {allUserLands.data && allUserLands.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {allUserLands.data.map((territoryWrapper, idx) => {
                            const land = territoryWrapper.account;
                            let blockTypeStr = 'standard';
                            const x = land.x;
                            const y = land.y;

                            // Apply coordinate-based classification
                            if ((x === 0 && y === 0) || (x === 49 && y === 0) || (x === 0 && y === 49) || (x === 49 && y === 49)) blockTypeStr = 'corner';
                            else if (x === 0 || y === 0 || x === 49 || y === 49) blockTypeStr = 'border';
                            else if (Math.abs(x - 25) <= 2 && Math.abs(y - 25) <= 2) blockTypeStr = 'capital';

                            // Only use on-chain type if coordinate classification falls through to 'standard'
                            if (blockTypeStr === 'standard' && land.territoryType) {
                                if (land.territoryType.capital) blockTypeStr = 'capital';
                                else if (land.territoryType.corner) blockTypeStr = 'corner';
                                else if (land.territoryType.border) blockTypeStr = 'border';
                            }

                            const mappedTerritory = {
                                id: land.id.toString(),
                                isListed: land.isListed,
                                level: land.level,
                                blockType: blockTypeStr,
                                x: land.x.toString(),
                                y: land.y.toString(),
                                hp: land.hp.toString(),
                                _rawPublicKey: territoryWrapper.publicKey
                            };

                            return (
                                <motion.div
                                    key={mappedTerritory.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <TerritoryCard
                                        territory={mappedTerritory}
                                        onList={handleListRequest}
                                        onCancel={handleCancelListing}
                                    />
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12 glass-card rounded-2xl border-2 border-dashed neon-border-secondary"
                    >
                        <MapPin size={48} className="mx-auto mb-4 text-gray-600" />
                        <p className="text-gray-400 text-sm mb-3 font-semibold">No territories owned</p>
                        <button
                            onClick={() => (document.querySelector('button[aria-label="Mint Territory"]') as HTMLButtonElement)?.click()}
                            className="text-emerald-400 text-sm font-bold hover:underline"
                        >
                            Mint First Territory →
                        </button>
                    </motion.div>
                )}
            </div>

            {/* List Land Modal */}
            {listModal.landPubkey && (
                <ListLandModal
                    isOpen={listModal.isOpen}
                    onClose={() => setListModal(prev => ({ ...prev, isOpen: false }))}
                    landPubkey={listModal.landPubkey}
                    landId={listModal.landId}
                    coordinates={listModal.coordinates}
                    currentPrice={listModal.currentPrice}
                    isEditing={listModal.isEditing}
                />
            )}
        </div>
    );
}
