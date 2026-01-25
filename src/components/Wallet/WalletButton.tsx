'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function WalletButton() {
    const { publicKey, connected } = useWallet();
    const { loadPlayer, player } = usePlayerStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (connected && publicKey) {
            loadPlayer(publicKey.toString());
            toast.success('Wallet connected!');
        }
    }, [connected, publicKey, loadPlayer]);

    // Prevent SSR rendering to avoid hydration mismatch
    if (!mounted) {
        return (
            <div className="h-[42px] w-[140px] bg-white/5 rounded-lg animate-pulse" />
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
                {connected && player && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden md:flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full"
                    >
                        <div className="flex flex-col items-end leading-none">
                            <span className="text-xs text-gray-400 font-medium">Territories</span>
                            <span className="text-sm font-bold text-white">{player.total_blocks_owned || 0}</span>
                        </div>
                        <div className="h-8 w-[1px] bg-white/10" />
                        <div className="flex flex-col items-end leading-none">
                            <span className="text-xs text-gray-400 font-medium">Revenue</span>
                            <span className="text-sm font-bold text-accent">
                                {(player.total_revenue_earned || 0).toFixed(2)} SOL
                            </span>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-200"></div>
                    <div className="relative flex items-center gap-2">
                        <WalletMultiButton className="!bg-[#0A0E27] !h-[42px] !border !border-white/10 !rounded-lg !font-semibold !text-sm !font-sans hover:!bg-gray-900 transition-all" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
