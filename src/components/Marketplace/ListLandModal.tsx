'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Coins, Tag, AlertTriangle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { PublicKey } from '@solana/web3.js';
import { useMarketplace } from '@/hooks/useMarketplace';

interface ListLandModalProps {
    isOpen: boolean;
    onClose: () => void;
    landPubkey: PublicKey;
    landId: string;
    coordinates: { x: string; y: string };
    currentPrice?: number;
    isEditing?: boolean;
}

export default function ListLandModal({
    isOpen,
    onClose,
    landPubkey,
    landId,
    coordinates,
    currentPrice,
    isEditing = false
}: ListLandModalProps) {
    const [price, setPrice] = useState<string>(currentPrice?.toString() || '');
    const { listLand, editList, isLoading } = useMarketplace();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        const numPrice = parseFloat(price);
        if (isNaN(numPrice) || numPrice <= 0) {
            toast.error('Please enter a valid price in SOL');
            return;
        }

        setIsSubmitting(true);
        try {
            let success = false;
            if (isEditing) {
                success = await editList(landPubkey, numPrice);
            } else {
                success = await listLand(landPubkey, numPrice);
            }

            if (success) {
                toast.success(isEditing ? 'Listing updated!' : 'Land listed for sale!');
                onClose();
            }
        } catch (error) {
            console.error('Listing error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-[#0f1624] rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Tag className="text-accent" size={20} />
                                    {isEditing ? 'Edit Listing' : 'List Territory for Sale'}
                                </h2>
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 Transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Territory Details</span>
                                    <span className="text-accent font-mono text-xs">ID #{landId}</span>
                                </div>
                                <p className="text-white font-bold">Position ({coordinates.x}, {coordinates.y})</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">
                                        Asking Price (SOL)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                            <Coins className="text-accent" size={18} />
                                        </div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="0.0"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-mono text-lg focus:outline-none focus:border-accent/50 transition-colors"
                                        />
                                    </div>
                                    <p className="mt-2 text-[10px] text-gray-500 ml-1">
                                        * A 2.5% marketplace fee will be deducted upon sale.
                                    </p>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !price}
                                    className="w-full bg-accent hover:bg-accent/80 text-white py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            <Tag size={20} />
                                            {isEditing ? 'Update Listing' : 'Confirm Listing'}
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={onClose}
                                    className="w-full bg-white/5 hover:bg-white/10 text-gray-400 py-3 rounded-2xl font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
