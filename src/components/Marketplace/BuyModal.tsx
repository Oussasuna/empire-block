'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Info, Wallet } from 'lucide-react';
import { Listing } from '@/hooks/useMarketplace';

interface BuyModalProps {
    listing: Listing | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (id: string) => void;
    isBuying: boolean;
}

export default function BuyModal({ listing, isOpen, onClose, onConfirm, isBuying }: BuyModalProps) {
    if (!listing) return null;

    const feePercent = 0.05;
    const fee = listing.price * feePercent;
    const total = listing.price + fee;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-[#0f1624] rounded-3xl border border-purple-500/30 overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.15)]"
                    >
                        {/* Status Bar */}
                        <div className="h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600" />

                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8">
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4 border border-purple-500/20">
                                    <ShieldCheck size={32} className="text-purple-400" />
                                </div>
                                <h2 className="text-2xl font-black text-white mb-2">Confirm Purchase</h2>
                                <p className="text-gray-400 text-sm">You are about to acquire Territory ({listing.x}, {listing.y})</p>
                            </div>

                            {/* Details List */}
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Item Price</span>
                                    <span className="text-white font-mono font-bold">{listing.price} SOL</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Market Fee</span>
                                        <Info size={12} className="text-gray-600" />
                                    </div>
                                    <span className="text-gray-400 font-mono text-sm">{fee.toFixed(4)} SOL (5%)</span>
                                </div>
                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-white font-black text-lg uppercase tracking-widest">Total Pay</span>
                                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                        {total.toFixed(4)} SOL
                                    </span>
                                </div>
                            </div>

                            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4 mb-8 flex gap-4">
                                <Wallet size={20} className="text-yellow-500 shrink-0" />
                                <p className="text-[11px] text-yellow-500/80 leading-relaxed font-semibold">
                                    Ensure you have enough SOL in your wallet to cover the transaction plus networking fees.
                                </p>
                            </div>

                            <button
                                onClick={() => onConfirm(listing.id)}
                                disabled={isBuying}
                                className={`
                                    w-full py-5 rounded-2xl font-black text-lg transition-all duration-300 relative overflow-hidden
                                    ${isBuying
                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 text-white hover:scale-[1.02] shadow-xl shadow-purple-500/20 active:scale-[0.98]'
                                    }
                                `}
                            >
                                {isBuying ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        <span>Transacting...</span>
                                    </div>
                                ) : (
                                    'Confirm & Purchase'
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
