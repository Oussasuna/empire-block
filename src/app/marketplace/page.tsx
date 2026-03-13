'use client';

import { useState } from 'react';
import { useMarketplace, Listing } from '@/hooks/useMarketplace';
import { useGameProgram } from '@/components/program/game';
import { useWallet } from '@solana/wallet-adapter-react';
import MarketStats from '@/components/Marketplace/MarketStats';
import FilterBar from '@/components/Marketplace/FilterBar';
import ListingCard from '@/components/Marketplace/ListingCard';
import BuyModal from '@/components/Marketplace/BuyModal';
import ListLandModal from '@/components/Marketplace/ListLandModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Ghost, LayoutGrid, User, Tag, X, MapPin, Loader2, Activity, ArrowRight, ShoppingBag } from 'lucide-react';
import { LandingNavbar } from '@/components/Landing/Navbar';
import { LandingFooter } from '@/components/Landing/CTABanner';
import { PublicKey } from '@solana/web3.js';
import { useMappedCoordinates } from '@/hooks/useMappedCoordinates';

type Tab = 'buy' | 'my-lands' | 'activity';

export default function MarketplacePage() {
    const { publicKey } = useWallet();
    const {
        listings,
        stats,
        isLoading,
        activity,
        isActivityLoading,
        filters,
        setFilters,
        buyTerritory,
        cancelList,
    } = useMarketplace();
    const { allUserLands } = useGameProgram();
    const { mappedCoords } = useMappedCoordinates();

    const [activeTab, setActiveTab] = useState<Tab>('buy');
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

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
        isEditing: false,
    });

    const handleBuyClick = (listing: Listing) => {
        setSelectedListing(listing);
        setIsBuyModalOpen(true);
    };

    const handleConfirmPurchase = async (id: string) => {
        if (!selectedListing) return;
        setIsBuying(true);
        const success = await buyTerritory(selectedListing);
        setIsBuying(false);
        if (success) {
            setIsBuyModalOpen(false);
            setSelectedListing(null);
        }
    };

    const filteredListings = listings.filter(l =>
        filters.type === 'all' || l.block_type === filters.type
    );

    // Build user land data
    const userLands = (allUserLands.data || []).map(w => {
        const land = w.account;
        
        const landStrId = land.id.toString();
        const coord = mappedCoords.get(landStrId);
        const x = coord?.x ?? 0;
        const y = coord?.y ?? 0;

        let blockType = 'standard';
        if (land.territoryType?.capital) blockType = 'capital';
        else if (land.territoryType?.corner) blockType = 'corner';
        else if (land.territoryType?.border) blockType = 'border';

        const activeListing = listings.find(l => l.landPubkey.toBase58() === w.publicKey.toBase58());

        return {
            id: land.id.toString(),
            x,
            y,
            blockType,
            level: land.level,
            isListed: !!land.isListed,
            publicKey: w.publicKey,
            activeListing,
        };
    });

    const handleOpenListModal = (land: typeof userLands[0]) => {
        setListModal({
            isOpen: true,
            landPubkey: land.publicKey,
            landId: land.id,
            coordinates: { x: land.x.toString(), y: land.y.toString() },
            currentPrice: land.activeListing?.price,
            isEditing: land.isListed,
        });
    };

    const handleCancelListing = async (land: typeof userLands[0]) => {
        if (!land.publicKey) return;
        setCancellingId(land.id);
        await cancelList(land.publicKey);
        setCancellingId(null);
    };

    const blockTypeColor: Record<string, { text: string; bg: string; border: string }> = {
        corner: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
        capital: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
        border: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
        standard: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    };

    return (
        <div className="min-h-screen bg-[#050510] text-white selection:bg-purple-500/30">
            <LandingNavbar />

            <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto relative">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-purple-600/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

                {/* Header */}
                <div className="relative z-10 flex flex-col items-center mb-12 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 shadow-[0_0_50px_rgba(168,85,247,0.15)] group hover:scale-110 transition-transform duration-300"
                    >
                        <Store className="text-purple-400 group-hover:rotate-12 transition-transform" size={32} />
                    </motion.div>
                    <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-4 uppercase italic">
                        Market<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#8B5CF6]">place</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs">
                        Trade Territories <span className="text-gray-600 mx-2">•</span> Expand Your Empire
                    </p>
                </div>

                {/* Market Statistics */}
                <MarketStats stats={stats} />

                {/* Tabs */}
                <div className="flex gap-2 mb-8 mt-10 p-1 bg-white/5 rounded-2xl border border-white/10 w-fit mx-auto">
                    <button
                        onClick={() => setActiveTab('buy')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 ${activeTab === 'buy'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <LayoutGrid size={16} />
                        Browse
                    </button>
                    {publicKey && (
                        <button
                            onClick={() => setActiveTab('my-lands')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 ${activeTab === 'my-lands'
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <User size={16} />
                            My Lands
                            {userLands.length > 0 && (
                                <span className="bg-white/10 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                    {userLands.length}
                                </span>
                            )}
                        </button>
                    )}
                    <button
                        onClick={() => setActiveTab('activity')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 ${activeTab === 'activity'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Activity size={16} />
                        Activity
                        {activity.length > 0 && (
                            <span className="bg-white/10 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                {activity.length}
                            </span>
                        )}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {/* ── BROWSE TAB ── */}
                    {activeTab === 'buy' && (
                        <motion.div
                            key="buy"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.2 }}
                        >
                            <FilterBar
                                activeType={filters.type}
                                onTypeChange={(type) => setFilters({ ...filters, type })}
                                activeSort={filters.sort}
                                onSortChange={(sort) => setFilters({ ...filters, sort })}
                            />

                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="h-[480px] bg-white/5 rounded-3xl animate-pulse border border-white/10" />
                                    ))}
                                </div>
                            ) : filteredListings.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 mb-12">
                                    <AnimatePresence mode="popLayout">
                                        {filteredListings.map((listing) => (
                                            <motion.div
                                                key={listing.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <ListingCard
                                                    listing={listing}
                                                    onBuy={handleBuyClick}
                                                    walletAddress={publicKey?.toBase58()}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-20 bg-white/5 rounded-3xl border-2 border-dashed border-white/10 mt-8"
                                >
                                    <Ghost size={64} className="mx-auto mb-6 text-gray-700" />
                                    <h3 className="text-2xl font-black mb-2">No listings found</h3>
                                    <p className="text-gray-500 max-w-xs mx-auto text-sm">Be the first player to list a territory in this category!</p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* ── MY LANDS TAB ── */}
                    {activeTab === 'my-lands' && publicKey && (
                        <motion.div
                            key="my-lands"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.2 }}
                        >
                            {allUserLands.isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse border border-white/10" />
                                    ))}
                                </div>
                            ) : userLands.length === 0 ? (
                                <div className="text-center py-20 bg-white/5 rounded-3xl border-2 border-dashed border-white/10">
                                    <MapPin size={64} className="mx-auto mb-6 text-gray-700" />
                                    <h3 className="text-2xl font-black mb-2">No territories owned</h3>
                                    <p className="text-gray-500 max-w-xs mx-auto text-sm">Mint your first territory to start building your empire!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {userLands.map((land, idx) => {
                                        const c = blockTypeColor[land.blockType] || blockTypeColor.standard;
                                        const isCancelling = cancellingId === land.id;
                                        return (
                                            <motion.div
                                                key={land.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.04 }}
                                                className={`relative overflow-hidden rounded-2xl p-4 border bg-black/40 backdrop-blur-xl ${c.border}`}
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-r ${c.bg} opacity-30`} />
                                                <div className="relative flex items-center justify-between gap-4 z-10">
                                                    {/* Left info */}
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${c.border} ${c.bg}`}>
                                                            <div className={`w-2.5 h-2.5 rounded-full ${c.bg.replace('/10', '/80')} border-2 ${c.border}`} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <span className={`font-mono font-black text-sm ${c.text}`}>
                                                                    [{land.x}, {land.y}]
                                                                </span>
                                                                {land.isListed && (
                                                                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-emerald-500/20">
                                                                        Listed {land.activeListing ? `· ${land.activeListing.price} SOL` : ''}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                                                {land.blockType} · Lvl {land.level} · #{land.id}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        {land.isListed ? (
                                                            <>
                                                                {/* Edit listing */}
                                                                <button
                                                                    onClick={() => handleOpenListModal(land)}
                                                                    disabled={isCancelling}
                                                                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg border border-white/10 transition-all disabled:opacity-40"
                                                                >
                                                                    Edit
                                                                </button>
                                                                {/* Cancel listing */}
                                                                <button
                                                                    onClick={() => handleCancelListing(land)}
                                                                    disabled={isCancelling}
                                                                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-rose-500/20 transition-all flex items-center gap-1 disabled:opacity-40"
                                                                >
                                                                    {isCancelling ? <Loader2 size={10} className="animate-spin" /> : <X size={10} />}
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleOpenListModal(land)}
                                                                className="px-4 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-emerald-500/20 transition-all flex items-center gap-1.5"
                                                            >
                                                                <Tag size={10} />
                                                                List for Sale
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── ACTIVITY TAB ── */}
                    {activeTab === 'activity' && (
                        <motion.div
                            key="activity"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isActivityLoading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse border border-white/10" />
                                    ))}
                                </div>
                            ) : activity.length === 0 ? (
                                <div className="text-center py-20 bg-white/5 rounded-3xl border-2 border-dashed border-white/10">
                                    <ShoppingBag size={64} className="mx-auto mb-6 text-gray-700" />
                                    <h3 className="text-2xl font-black mb-2">No activity yet</h3>
                                    <p className="text-gray-500 max-w-xs mx-auto text-sm">Sales will appear here once territories start trading hands.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* Header row */}
                                    <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
                                        <span>Territory</span>
                                        <span>Seller → Buyer</span>
                                        <span>Price</span>
                                        <span>When</span>
                                    </div>
                                    {activity.map((item: typeof activity[0], idx: number) => {
                                        const blockColors: Record<string, string> = {
                                            corner: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                                            capital: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
                                            border: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
                                            standard: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
                                        };
                                        const colorClass = blockColors[item.blockType] || blockColors.standard;
                                        const timeAgo = item.timestamp
                                            ? (() => {
                                                const diff = Date.now() - item.timestamp;
                                                const m = Math.floor(diff / 60000);
                                                const h = Math.floor(diff / 3600000);
                                                const d = Math.floor(diff / 86400000);
                                                if (d > 0) return `${d}d ago`;
                                                if (h > 0) return `${h}h ago`;
                                                if (m > 0) return `${m}m ago`;
                                                return 'just now';
                                            })()
                                            : '—';

                                        return (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.03 }}
                                                className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-purple-500/20 rounded-2xl px-5 py-4 transition-all group"
                                            >
                                                {/* Territory */}
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border text-xs font-black ${colorClass}`}>
                                                        <MapPin size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="font-mono font-black text-white text-sm">[{item.x}, {item.y}]</p>
                                                        <p className={`text-[10px] uppercase font-bold tracking-wider ${colorClass.split(' ')[0]}`}>{item.blockType}</p>
                                                    </div>
                                                </div>

                                                {/* Seller → Buyer */}
                                                <div className="flex items-center gap-2 text-xs font-mono">
                                                    <span className="text-gray-500 truncate max-w-[80px]" title={item.seller}>
                                                        {item.seller.slice(0, 4)}…{item.seller.slice(-4)}
                                                    </span>
                                                    <ArrowRight size={12} className="text-gray-600 shrink-0" />
                                                    <span className="text-gray-300 truncate max-w-[80px]" title={item.buyer}>
                                                        {item.buyer.slice(0, 4)}…{item.buyer.slice(-4)}
                                                    </span>
                                                </div>

                                                {/* Price */}
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-white font-black text-lg font-mono">{item.price.toFixed(3)}</span>
                                                    <span className="text-purple-400 text-xs font-bold">SOL</span>
                                                </div>

                                                {/* Timestamp */}
                                                <span className="text-[11px] text-gray-500 font-bold whitespace-nowrap">{timeAgo}</span>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Buy Confirmation Modal */}
            <BuyModal
                listing={selectedListing}
                isOpen={isBuyModalOpen}
                onClose={() => setIsBuyModalOpen(false)}
                onConfirm={handleConfirmPurchase}
                isBuying={isBuying}
            />

            {/* List / Edit Land Modal */}
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

            <LandingFooter />
        </div>
    );
}
