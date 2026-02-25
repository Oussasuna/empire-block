'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Crown, FileText } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import for the 3D grid preview to avoid SSR issues
const GridCanvas = dynamic(() => import('@/components/Grid/GridCanvas'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#050510] animate-pulse rounded-2xl" />,
});

export const Hero = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Interactive Follower Glow */}
            <motion.div
                className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
                animate={{
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(124, 58, 237, 0.08), transparent 80%)`,
                }}
            />

            {/* Background Glows */}
            <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] glow-cyan opacity-20 pointer-events-none blur-[120px]" />
            <div className="absolute bottom-1/4 -left-20 w-[600px] h-[600px] glow-purple opacity-20 pointer-events-none blur-[120px]" />

            <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-[1.2fr,0.8fr] gap-12 items-center">
                {/* Left Side: Content */}
                <div className="relative z-10 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20"
                    >
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Solana Strategy Game</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tight"
                    >
                        Build Your <br />
                        <span className="text-gradient-purple-cyan">Empire</span> <br />
                        on Chain
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-custom max-w-xl leading-relaxed"
                    >
                        Conquer territories, earn passive SOL revenue, and battle for supremacy in a 50×50 persistent world.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-6 pt-4"
                    >
                        <motion.div
                            className="wallet-adapter-dropdown"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        >
                            <WalletMultiButton className="!bg-gradient-to-r !from-primary !to-[#6D28D9] !h-16 !px-10 !rounded-full !text-lg !font-bold !border-none !text-white flex items-center gap-3 shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:!shadow-[0_0_50px_rgba(124,58,237,0.5)] !transition-shadow">
                                <Wallet size={20} className="mr-2" />
                                Connect Wallet
                            </WalletMultiButton>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        >
                            <Link href="/docs" className="h-16 px-10 rounded-full border border-primary/50 bg-transparent text-white font-bold text-lg hover:bg-primary/10 hover:border-primary transition-all flex items-center gap-3 group shadow-[0_0_20px_rgba(124,58,237,0.15)] hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]">
                                Docs
                                <FileText size={18} className="group-hover:rotate-6 transition-transform text-purple-400" />
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-10 pt-10"
                    >
                        <HeroStat value="2.5K+" label="Territories" />
                        <div className="w-px h-10 bg-white/10" />
                        <HeroStat value="145" label="Active Empires" />
                        <div className="w-px h-10 bg-white/10" />
                        <HeroStat value="500+" label="SOL Volume" />
                    </motion.div>
                </div>

                {/* Right Side: 3D Grid Preview */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="relative lg:justify-self-end mt-20 lg:mt-0 w-full"
                >
                    {/* Grid Container */}
                    <div className="relative rounded-3xl bg-white/5 border border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
                        {/* 3D Grid Canvas — fills the entire card */}
                        <div className="w-full aspect-square min-h-[400px] md:min-h-[520px] pointer-events-none">
                            <GridCanvas selectedCell={null} />
                        </div>

                        {/* Subtle glow ring */}
                        <div className="absolute inset-0 rounded-3xl border border-secondary/20 animate-pulse pointer-events-none" />
                    </div>

                    {/* Activity Card — positioned below the grid */}
                    <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="mt-6 ml-4 glass-card p-5 rounded-2xl w-72 shadow-2xl"
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                                <Crown size={20} />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-gray-custom uppercase tracking-wider">Top Conqueror</div>
                                <div className="text-sm font-black text-white">Warrior DAO</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-custom">Minted Territory</span>
                                <span className="text-white font-mono">(25,30)</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-custom text-[10px]">15s ago</span>
                                <span className="text-green-400 font-bold flex items-center gap-1">
                                    <TrendingUp size={12} />
                                    +0.2 SOL
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

const HeroStat = ({ value, label }: { value: string; label: string }) => (
    <div>
        <div className="text-2xl font-black text-white leading-none mb-1">{value}</div>
        <div className="text-[10px] font-bold text-gray-custom uppercase tracking-widest">{label}</div>
    </div>
);
