'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    X, MapPin, Crown, Coins, TrendingUp, Wallet,
    AlertTriangle, Sparkles, Zap, Image as ImageIcon
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMintTerritory } from '@/hooks/useMintTerritory';
import { useTerritory } from '@/hooks/useTerritory';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ImageUpload from './ImageUpload';
import { uploadImageToArweave } from '@/lib/metaplex/uploadImage';

interface TerritoryModalProps {
    x: number;
    y: number;
    onClose: () => void;
}

export default function TerritoryModal({ x, y, onClose }: TerritoryModalProps) {
    const { publicKey } = useWallet();
    const { territory, isLoading } = useTerritory(x, y);
    const { mintTerritory, isMinting } = useMintTerritory();
    const [error, setError] = useState<string | null>(null);
    const [uploadedImageUri, setUploadedImageUri] = useState<string | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const handleImageUpload = async (file: File) => {
        setIsUploadingImage(true);
        try {
            // TODO: This will work once dependencies are installed
            // const uri = await uploadImageToArweave(file, connection, wallet);
            // setUploadedImageUri(uri);
            // toast.success('Image uploaded to Arweave!');

            toast.error('Image upload requires Metaplex dependencies. Please install them first.');
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(error.message || 'Failed to upload image');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleMint = async () => {
        if (!publicKey) {
            toast.error('Please connect your wallet first');
            return;
        }
        setError(null);

        // Pass uploaded image URI to minting function
        const signature = await mintTerritory(x, y, uploadedImageUri || undefined);
        if (signature) {
            toast.success('Territory application submitted!');
            onClose();
        } else {
            setError('Transaction failed. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-lg bg-gradient-to-br from-[#0f1624] via-[#1a1f35] to-[#0f1624] rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden shadow-purple-500/10"
            >
                {/* Glow Effect */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 z-10 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        {/* Coordinate Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4">
                            <MapPin size={14} className="text-cyan-400" />
                            <span className="text-sm font-mono font-semibold text-gray-300">
                                ({x}, {y})
                            </span>
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                            <Crown className="text-purple-400" size={32} />
                            <h2 className="text-3xl font-bold text-white tracking-tight">Unclaimed Land</h2>
                        </div>
                        <p className="text-gray-400 text-center text-sm max-w-xs">
                            Start building your legacy and earn passive SOL from this territory.
                        </p>
                    </div>

                    {/* Main Info Card */}
                    <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-6 mb-6 group hover:bg-purple-500/10 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                                    <Coins className="text-purple-400" size={28} />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Mint Price</p>
                                    <p className="text-white text-2xl font-bold">0.1 <span className="text-purple-400">SOL</span></p>
                                </div>
                            </div>
                            <Sparkles className="text-purple-400/40 animate-pulse" size={24} />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Rarity</p>
                            <p className="text-white font-semibold">Standard</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                            <div className="flex items-center gap-1.5 mb-1">
                                <TrendingUp size={10} className="text-cyan-400" />
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Revenue</p>
                            </div>
                            <p className="text-cyan-400 font-bold text-lg">1.0x</p>
                        </div>
                    </div>

                    {/* Benefits List */}
                    <div className="mb-8">
                        <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                            <Zap size={16} className="text-yellow-400" />
                            Territory Benefits
                        </h3>
                        <ul className="space-y-3">
                            {[
                                'Earn from every territory sale',
                                'Form empires for massive bonuses',
                                'Battle to expand and conquer'
                            ].map((benefit, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-400">
                                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Image Upload Section */}
                    <div className="mb-8">
                        <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                            <ImageIcon size={16} className="text-purple-400" />
                            Customize Your Territory (Optional)
                        </h3>

                        <ImageUpload
                            onUpload={handleImageUpload}
                            preview={uploadedImageUri}
                            isUploading={isUploadingImage}
                        />
                    </div>

                    {/* CTA Button */}
                    <div className="space-y-4">
                        <button
                            onClick={handleMint}
                            disabled={!publicKey || isMinting}
                            className={`
                                w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300
                                flex items-center justify-center gap-3 relative overflow-hidden
                                ${!publicKey
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02]'}
                            `}
                        >
                            {isMinting ? (
                                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Crown size={20} />
                                    Mint Territory
                                </>
                            )}
                        </button>

                        {!publicKey && (
                            <div className="flex items-center justify-center gap-2 text-yellow-500/80 text-xs">
                                <AlertTriangle size={14} />
                                <span>Connect wallet to start building your empire</span>
                            </div>
                        )}

                        {error && (
                            <div className="text-red-400 text-center text-xs bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                {/* Loading Overlay */}
                {isMinting && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center pointer-events-none" />
                )}
            </motion.div>
        </div>
    );
}
