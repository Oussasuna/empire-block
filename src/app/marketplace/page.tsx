'use client';

import { useState } from 'react';
import { useMarketplace, Listing } from '@/hooks/useMarketplace';
import MarketStats from '@/components/Marketplace/MarketStats';
import FilterBar from '@/components/Marketplace/FilterBar';
import ListingCard from '@/components/Marketplace/ListingCard';
import BuyModal from '@/components/Marketplace/BuyModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Ghost } from 'lucide-react';
import { LandingNavbar } from '@/components/Landing/Navbar';
import { LandingFooter } from '@/components/Landing/CTABanner';

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
        <div className="min-h-screen bg-[#050510] text-white selection:bg-purple-500/30">
            <LandingNavbar />

            <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto relative">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-purple-600/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

                {/* Header */}
                <div className="relative z-10 flex flex-col items-center mb-16 text-center">
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
            <LandingFooter />
        </div>
    );
}
