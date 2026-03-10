'use client';

import React, { useState } from 'react';
import { Crown, Menu, X } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export const LandingNavbar = ({ onOpenMarketplace }: { onOpenMarketplace?: () => void }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = [
        { label: 'Grid', href: '/grid' },
        { label: 'Marketplace', href: '/marketplace' },
        { label: 'Battles', href: '/battles' },
        { label: 'Leaderboard', href: '/leaderboard' },
        { label: 'Docs', href: '/docs' },
    ];

    return (
        <nav className="sticky top-0 left-0 right-0 z-50 glass-nav border-b border-white/5 md:border-none">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-20 flex items-center justify-between">
                {/* Left: Logo */}
                <Link href="/" className="flex items-center gap-2.5 md:gap-4 group">
                    <div className="bg-primary p-1 md:p-2 rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-transform group-hover:scale-105">
                        <Crown className="text-white w-4 h-4 md:w-6 md:h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-base md:text-xl font-bold text-white tracking-tight leading-tight">EMPIRE BLOCKS</span>
                            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                                <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[8px] md:text-[10px] font-bold text-primary uppercase tracking-wider">Live on Devnet</span>
                            </div>
                        </div>
                        <div className="text-[8px] md:text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em] leading-none mt-0.5">
                            Solana Strategy
                        </div>
                    </div>
                </Link>

                {/* Center: Desktop Links */}
                <div className="hidden lg:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <NavLink key={link.label} label={link.label} href={link.href} />
                    ))}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="hidden sm:block wallet-adapter-dropdown">
                        <WalletMultiButton className="!bg-gradient-to-r !from-primary !to-[#6D28D9] hover:!shadow-[0_0_20px_rgba(124,58,237,0.4)] !transition-all !rounded-full !h-10 md:!h-11 !px-6 md:!px-8 !text-xs md:!text-sm !font-bold !border-none !text-white" />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={toggleMenu}
                        className="lg:hidden p-2 text-white hover:text-primary transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="lg:hidden overflow-hidden bg-black/95 backdrop-blur-2xl border-b border-white/10"
                    >
                        <div className="flex flex-col p-6 gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-lg font-bold text-white/80 hover:text-white transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-white/10 sm:hidden">
                                <WalletMultiButton className="!w-full !bg-gradient-to-r !from-primary !to-[#6D28D9] !h-12 !rounded-xl !text-sm !font-bold !border-none !text-white" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const NavLink = ({ label, href }: { label: string; href: string }) => (
    <Link
        href={href}
        className="relative text-sm font-bold text-white/70 hover:text-white transition-colors group"
    >
        {label}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#06B6D4] transition-all group-hover:w-full" />
    </Link>
);
