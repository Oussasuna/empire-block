'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { LayoutGrid, User } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

// Landing Components (Stylish AAA version)
import { LandingNavbar } from '@/components/Landing/Navbar';
import { Hero } from '@/components/Landing/Hero';
import { LeaderboardPreview } from '@/components/Landing/LeaderboardPreview';
import { Features } from '@/components/Landing/Features';
import { HowItWorks } from '@/components/Landing/HowItWorks';

import { CTABanner, LandingFooter } from '@/components/Landing/CTABanner';

// Game Components
import { useGrid } from '@/hooks/useGrid';
import Grid2D from '@/components/Grid/Grid2D';
import PlayerDashboard from '@/components/Dashboard/PlayerDashboard';
import TerritoryModal from '@/components/Territory/TerritoryModal';

export default function Home() {
    const { connected, publicKey } = useWallet();
    const [activeTab, setActiveTab] = useState<'grid' | 'dashboard'>('grid');
    const [selectedCell, setSelectedCell] = useState<{ x: number, y: number } | null>(null);
    const { territories, isLoading } = useGrid();

    // If NOT connected, show the stylish AAA landing page
    if (!connected) {
        return (
            <div className="flex flex-col w-full overflow-x-hidden">
                <LandingNavbar />
                <Hero />
                <LeaderboardPreview />
                <HowItWorks />
                <Features />
                <CTABanner />
                <LandingFooter />
            </div>
        );
    }

    // If connected, show the interactive Game UI
    const handleCellClick = (x: number, y: number) => {
        setSelectedCell({ x, y });
    };

    const handleCloseModal = () => {
        setSelectedCell(null);
    };

    return (
        <div className="relative flex flex-col h-screen overflow-hidden">
            {/* Game Navbar / Header */}
            <LandingNavbar />

            <div className="relative flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Tab Switcher (Mobile) */}
                <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 z-40 flex rounded-2xl p-1.5 shadow-2xl">
                    <button
                        onClick={() => setActiveTab('grid')}
                        className={`px-6 py-2 rounded-xl flex items-center gap-2 transition-all ${activeTab === 'grid'
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <LayoutGrid size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Grid</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-6 py-2 rounded-xl flex items-center gap-2 transition-all ${activeTab === 'dashboard'
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <User size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Base</span>
                    </button>
                </div>

                {/* Desktop/Mobile Shared Canvas */}
                <div className={`flex-1 relative z-10 bg-black/40 ${activeTab === 'grid' ? 'flex' : 'hidden md:flex'}`}>
                    {isLoading ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        </div>
                    ) : (
                        <Grid2D
                            territories={territories}
                            selectedCell={selectedCell}
                            onCellClick={handleCellClick}
                            userWallet={publicKey?.toString() || null}
                        />
                    )}
                </div>

                {/* Player Dashboard Column */}
                <div className={`md:w-[400px] bg-[#050510] border-l border-white/5 relative z-20 overflow-y-auto ${activeTab === 'dashboard' ? 'flex flex-col flex-1' : 'hidden md:flex flex-col'}`}>
                    <PlayerDashboard />
                </div>
            </div>

            {/* Territory Modal */}
            <AnimatePresence>
                {selectedCell && (
                    <TerritoryModal
                        key={`${selectedCell.x}-${selectedCell.y}`}
                        x={selectedCell.x}
                        y={selectedCell.y}
                        onClose={handleCloseModal}
                    />
                )}
            </AnimatePresence>

            {/* Debug State */}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed bottom-24 left-6 z-50 pointer-events-none opacity-50">
                    <div className="text-[10px] font-mono text-primary font-bold bg-black/50 px-2 py-1 rounded">
                        Neural State: {connected ? 'Connected' : 'External'} | {activeTab.toUpperCase()}
                    </div>
                </div>
            )}
        </div>
    );
}
