'use client';

import React from 'react';
import { Crown } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';

export const LandingNavbar = ({ onOpenMarketplace }: { onOpenMarketplace?: () => void }) => {
    return (
        <nav className="sticky top-0 left-0 right-0 z-50 glass-nav">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Left: Logo */}
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="bg-primary p-2 rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-transform group-hover:scale-105">
                        <Crown className="text-white" size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-white tracking-tight">EMPIRE BLOCKS</span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Live on Devnet</span>
                            </div>
                        </div>
                        <div className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em] leading-none mt-0.5">
                            Solana Strategy
                        </div>
                    </div>
                </Link>

                {/* Center: Links */}
                <div className="hidden lg:flex items-center gap-10">
                    <NavLink label="Grid" href="/grid" />
                    <NavLink label="Marketplace" href="/marketplace" />
                    <NavLink label="Battles" href="/battles" />
                    <NavLink label="Leaderboard" href="/leaderboard" />
                    <NavLink label="Docs" href="/docs" />
                </div>

                {/* Right: Wallet */}
                <div className="flex items-center gap-4">
                    <div className="wallet-adapter-dropdown">
                        <WalletMultiButton className="!bg-gradient-to-r !from-primary !to-[#6D28D9] hover:!shadow-[0_0_20px_rgba(124,58,237,0.4)] !transition-all !rounded-full !h-11 !px-8 !text-sm !font-bold !border-none !text-white" />
                    </div>
                </div>
            </div>
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
