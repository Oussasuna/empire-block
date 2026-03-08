'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Crown, FileText } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import Grid2D from '@/components/Grid/Grid2D';
import { useGrid } from '@/hooks/useGrid';

export const Hero = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const { territories, isLoading } = useGrid();

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center pt-16 md:pt-20 overflow-hidden">
            {/* Interactive Follower Glow - Desktop only for performance */}
            <motion.div
                className="hidden lg:block pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
                animate={{
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(124, 58, 237, 0.08), transparent 80%)`,
                }}
            />

            {/* Background Glows */}
            <div className="absolute top-1/4 -right-20 w-[300px] md:w-[600px] h-[300px] md:h-[600px] glow-cyan opacity-20 pointer-events-none blur-[60px] md:blur-[120px]" />
            <div className="absolute bottom-1/4 -left-20 w-[300px] md:w-[600px] h-[300px] md:h-[600px] glow-purple opacity-20 pointer-events-none blur-[60px] md:blur-[120px]" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex flex-col lg:grid lg:grid-cols-[1.2fr,0.8fr] gap-10 lg:gap-12 items-center py-12 md:py-20">
                {/* Side: Content */}
                <div className="relative z-10 space-y-6 md:space-y-8 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20"
                    >
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-[0.2em]">Solana Strategy Game</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-[clamp(2.5rem,8vw,5.5rem)] md:text-8xl font-black text-white leading-[1.05] md:leading-[0.9] tracking-tight"
                    >
                        Build Your <br />
                        <span className="text-gradient-purple-cyan">Empire</span> <br className="hidden sm:block" />
                        on Chain
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base md:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
                    >
                        Conquer territories, earn passive SOL revenue, and battle for supremacy in a 50×50 persistent world.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 md:gap-6 pt-2 md:pt-4"
                    >
                        <motion.div
                            className="wallet-adapter-dropdown w-full sm:w-auto"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <WalletMultiButton className="!bg-gradient-to-r !from-primary !to-[#6D28D9] !h-12 md:!h-16 !px-8 md:!px-10 !rounded-full !text-base md:!text-lg !font-bold !border-none !text-white flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(124,58,237,0.3)] !w-full" />
                        </motion.div>
                        <motion.div
                            className="w-full sm:w-auto"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link href="/docs" className="h-12 md:h-16 px-8 md:px-10 rounded-full border border-primary/50 bg-transparent text-white font-bold text-base md:text-lg hover:bg-primary/10 hover:border-primary transition-all flex items-center justify-center gap-3 group shadow-[0_0_20px_rgba(124,58,237,0.15)] w-full">
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
                        className="grid grid-cols-3 lg:flex items-center justify-center lg:justify-start gap-4 md:gap-10 pt-6 md:pt-10"
                    >
                        <HeroStat value="2.5K+" label="Territories" />
                        <div className="hidden lg:block w-px h-8 md:h-10 bg-white/10" />
                        <HeroStat value="145" label="Empires" />
                        <div className="hidden lg:block w-px h-8 md:h-10 bg-white/10" />
                        <HeroStat value="500+" label="SOL Vol" />
                    </motion.div>
                </div>

                {/* Side: 3D Grid Preview */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="relative lg:justify-self-end w-full max-w-[520px]"
                >
                    {/* Grid Container */}
                    <div className="relative rounded-3xl bg-white/5 border border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
                        {/* 2D Grid Preview — fills the entire card */}
                        <div className="w-full aspect-square min-h-[300px] sm:min-h-[400px] md:min-h-[520px]">
                            {isLoading ? (
                                <div className="w-full h-full bg-[#050510] animate-pulse flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                                </div>
                            ) : (
                                <Grid2D 
                                    territories={territories} 
                                    selectedCell={null} 
                                    onCellClick={() => {}} 
                                />
                            )}
                        </div>

                        {/* Subtle glow ring */}
                        <div className="absolute inset-0 rounded-3xl border border-secondary/20 animate-pulse pointer-events-none" />
                    </div>

                    {/* Activity Card — positioned below the grid */}
                    <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="mt-6 lg:mt-6 mx-auto lg:ml-4 glass-card p-4 md:p-5 rounded-2xl w-full sm:max-w-[280px] md:w-72 shadow-2xl relative z-10"
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                                <Crown className="w-[18px] h-[18px] md:w-5 md:h-5" />
                            </div>
                            <div>
                                <div className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Top Conqueror</div>
                                <div className="text-xs md:text-sm font-black text-white">Warrior DAO</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] md:text-xs">
                                <span className="text-gray-400">Minted Territory</span>
                                <span className="text-white font-mono">(25,30)</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-[9px] md:text-[10px]">15s ago</span>
                                <span className="text-green-400 font-bold flex items-center gap-1 text-[11px] md:text-xs">
                                    <TrendingUp className="w-[10px] h-[10px] md:w-3 md:h-3" />
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
        <div className="text-xl md:text-2xl font-black text-white leading-none mb-1">{value}</div>
        <div className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</div>
    </div>
);
