'use client';

import Link from 'next/link';
import WalletButton from '../Wallet/WalletButton';
import {
    Crown, LayoutGrid, ShoppingBag, Swords, TrendingUp, Menu, X, HelpCircle
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


interface HeaderProps {
    onOpenMarketplace?: () => void;
}

export default function Header({ onOpenMarketplace }: HeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { href: '/', icon: LayoutGrid, label: 'Grid' },
        { href: '/marketplace', icon: ShoppingBag, label: 'Marketplace', onClick: onOpenMarketplace },
        { href: '/battles', icon: Swords, label: 'Battles' },
        { href: '/leaderboard', icon: TrendingUp, label: 'Leaderboard' },
    ];

    return (
        <>
            <header className="bg-gradient-to-b from-[#0f1624] to-transparent border-b border-white/5 sticky top-0 z-40 backdrop-blur-xl">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                                <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 p-2.5 rounded-xl border border-purple-400/30">
                                    <Crown className="text-white" size={24} />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Empire Blocks</h1>
                                <p className="text-xs text-purple-400 font-medium">Solana Strategy</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={item.onClick}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/10"
                                >
                                    <item.icon size={18} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* Right Area (Wallet + Mobile Toggle) */}
                        <div className="flex items-center gap-4">
                            <WalletButton />

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors border border-white/5"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-50 bg-[#0f1624]/95 backdrop-blur-2xl md:hidden overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg">
                                        <Crown className="text-white" size={20} />
                                    </div>
                                    <span className="text-xl font-bold text-white">Menu</span>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-3">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            if (item.onClick) item.onClick();
                                        }}
                                        className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all text-white"
                                    >
                                        <div className="p-2 bg-purple-600/20 rounded-xl text-purple-400">
                                            <item.icon size={24} />
                                        </div>
                                        <span className="text-lg font-semibold">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
