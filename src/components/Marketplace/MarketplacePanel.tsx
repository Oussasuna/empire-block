'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Filter, Search, MapPin, Loader2, Coins } from 'lucide-react';
import { useMarketplace, Listing } from '@/hooks/useMarketplace';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface MarketplacePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MarketplacePanel({ isOpen, onClose }: MarketplacePanelProps) {
    const { listings, fetchListings, buyTerritory, isLoading } = useMarketplace();
    const { publicKey } = useWallet();
    const [buyingId, setBuyingId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchListings();
        }
    }, [isOpen, fetchListings]);

    const handleBuy = async (listing: Listing) => {
        if (!publicKey) return;
        setBuyingId(listing.id);
        const success = await buyTerritory(listing.id);
        if (success) {
            setBuyingId(null);
        } else {
            setBuyingId(null);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] glass-panel border-l border-white/10 z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex flex-col gap-4 bg-black/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-secondary/20 p-2 rounded-lg">
                                        <ShoppingCart className="text-secondary" size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white font-heading">Marketplace</h2>
                                        <p className="text-gray-400 text-xs">Buy and sell strategic territories</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Search & Filter (Visual only for now) */}
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search coordinates..."
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-secondary/50"
                                    />
                                </div>
                                <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <Filter size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Listings List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {isLoading && listings.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 gap-4">
                                    <Loader2 className="animate-spin text-secondary" size={32} />
                                    <p className="text-gray-400">Loading Market Data...</p>
                                </div>
                            ) : listings.length > 0 ? (
                                listings.map((listing) => (
                                    <motion.div
                                        key={listing.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="glass-card p-4 rounded-xl border border-white/5 hover:border-secondary/30 transition-colors group"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white
                                                    ${listing.territory?.block_type === 'capital' ? 'bg-danger' :
                                                        listing.territory?.block_type === 'corner' ? 'bg-warning' :
                                                            listing.territory?.block_type === 'border' ? 'bg-secondary' : 'bg-gray-700'}
                                                `}>
                                                    <MapPin size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                        Territory ({listing.territory?.x_coordinate}, {listing.territory?.y_coordinate})
                                                    </h3>
                                                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                                                        {listing.territory?.block_type || 'Standard'} Block
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-accent font-mono flex items-center justify-end gap-1">
                                                    <Coins size={16} />
                                                    {listing.price} SOL
                                                </p>
                                                <p className="text-[10px] text-gray-500">
                                                    Seller: {listing.seller_wallet.slice(0, 4)}...{listing.seller_wallet.slice(-4)}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleBuy(listing)}
                                            disabled={!publicKey || buyingId === listing.id}
                                            className="w-full mt-2 bg-white/5 hover:bg-secondary hover:text-white text-gray-300 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-secondary group-hover:text-white"
                                        >
                                            {buyingId === listing.id ? (
                                                <Loader2 className="animate-spin" size={16} />
                                            ) : (
                                                <ShoppingCart size={16} />
                                            )}
                                            {buyingId === listing.id ? 'Processing...' : 'Purchase Territory'}
                                        </button>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShoppingCart className="text-gray-600" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No Active Listings</h3>
                                    <p className="text-gray-400 max-w-[200px] mx-auto">
                                        The market is quiet. Be the first to list a territory!
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
