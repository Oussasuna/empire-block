'use client';

import { useState } from 'react';
import { useMarketplace, Listing } from '@/hooks/useMarketplace';
import MarketStats from '@/components/Marketplace/MarketStats';
import FilterBar from '@/components/Marketplace/FilterBar';
import ListingCard from '@/components/Marketplace/ListingCard';
import BuyModal from '@/components/Marketplace/BuyModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Ghost } from 'lucide-react';

export default function MarketplacePage() {
    const {
        listings,
        stats,
        isLoading,
        filters,
        setFilters,
        buyTerritory
    } = useMarketplace();

    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [isBuying, setIsBuying] = useState(false);

    const handleBuyClick = (listing: Listing) => {
        setSelectedListing(listing);
        setIsBuyModalOpen(true);
    };

    const handleConfirmPurchase = async (id: string) => {
        setIsBuying(true);
        const success = await buyTerritory(id);
        setIsBuying(false);
        if (success) {
            setIsBuyModalOpen(false);
            setSelectedListing(null);
        }
    };

    const filteredListings = listings.filter(l =>
        filters.type === 'all' || l.block_type === filters.type
    );

    return (
        <div className="min-h-screen bg-[#0A0E27] text-white py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 border border-purple-400/30">
                            <Store size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight mb-1">Marketplace</h1>
                            <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest">Trade territories and expand your influence</p>
                        </div>
                    </div>
                </div>

                {/* Market Statistics */}
                <MarketStats stats={stats} />

                {/* Filters & Controls */}
                <FilterBar
                    activeType={filters.type}
                    onTypeChange={(type) => setFilters({ ...filters, type })}
                    activeSort={filters.sort}
                    onSortChange={(sort) => setFilters({ ...filters, sort })}
                />

                {/* Listings Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-[480px] bg-white/5 rounded-3xl animate-pulse border border-white/10" />
                        ))}
                    </div>
                ) : (
                    <>
                        {filteredListings.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 bg-white/5 rounded-3xl border-2 border-dashed border-white/10"
                            >
                                <Ghost size={64} className="mx-auto mb-6 text-gray-700" />
                                <h3 className="text-2xl font-black mb-2">No listings found</h3>
                                <p className="text-gray-500 max-w-xs mx-auto text-sm">Be the first player to list a territory in this category!</p>
                            </motion.div>
                        )}
                    </>
                )}
            </div>

            {/* Confirmation Modal */}
            <BuyModal
                listing={selectedListing}
                isOpen={isBuyModalOpen}
                onClose={() => setIsBuyModalOpen(false)}
                onConfirm={handleConfirmPurchase}
                isBuying={isBuying}
            />
        </div>
    );
}
