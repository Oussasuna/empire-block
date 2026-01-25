'use client';

import { motion } from 'framer-motion';
import { MapPin, Crown, TrendingUp } from 'lucide-react';
import { Listing } from '@/hooks/useMarketplace';

interface ListingCardProps {
    listing: Listing;
    onBuy: (listing: Listing) => void;
}

export default function ListingCard({ listing, onBuy }: ListingCardProps) {
    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'capital': return { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' };
            case 'border': return { color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' };
            case 'corner': return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' };
            default: return { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-white/10' };
        }
    };

    const typeStyle = getTypeLabel(listing.block_type);

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-white/10 overflow-hidden group transition-all duration-300 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10"
        >
            {/* Map Preview Placeholder */}
            <div className="h-44 bg-[#0a0e27] relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500 via-transparent to-transparent" />
                <div className="w-full h-full border-b border-white/5 opacity-10 grid grid-cols-8 grid-rows-6">
                    {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} className="border border-white/5" />
                    ))}
                </div>
                {/* Simulated Grid Point */}
                <div className={`w-4 h-4 rounded-sm shadow-lg z-10 animate-pulse ${typeStyle.color.replace('text', 'bg')}`} />

                {/* Floating Coordinates Badge */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                    <MapPin size={12} className="text-cyan-400" />
                    <span className="text-[10px] font-mono font-bold text-white">({listing.x}, {listing.y})</span>
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest mb-2 ${typeStyle.bg} ${typeStyle.color} border ${typeStyle.border}`}>
                            <Crown size={10} />
                            {listing.block_type}
                        </div>
                        <h3 className="text-white font-black text-lg">Territory #{listing.id}</h3>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-cyan-400 mb-0.5">
                            <TrendingUp size={14} />
                            <span className="text-xs font-bold">{listing.revenue_multiplier}x</span>
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Revenue</p>
                    </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5">
                    <div className="flex justify-between items-baseline mb-1">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Price</p>
                        <p className="text-[10px] text-gray-400 font-mono">{listing.seller_wallet}</p>
                    </div>
                    <p className="text-2xl font-black text-white">{listing.price} <span className="text-purple-400 text-sm">SOL</span></p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onBuy(listing)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black py-4 rounded-xl text-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-purple-500/20"
                    >
                        Buy Now
                    </button>
                    <button className="px-4 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-gray-400 hover:text-white">
                        <TrendingUp size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
