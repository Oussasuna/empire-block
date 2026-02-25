'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { LayoutGrid, User, Shield, Coins, Activity } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Landing Components (Stylish AAA version)
import { LandingNavbar } from '@/components/Landing/Navbar';
import { LandingFooter } from '@/components/Landing/CTABanner';

// Game Components
import PlayerDashboard from '@/components/Dashboard/PlayerDashboard';
import TerritoryModal from '@/components/Territory/TerritoryModal';

const GridCanvas = dynamic(() => import('@/components/Grid/GridCanvas'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-[#050510] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-primary font-black uppercase tracking-[0.3em] animate-pulse">Initializing Neural Grid...</p>
        </div>
    )
});

export default function GridExplorerPage() {
    const { connected } = useWallet();
    const [activeTab, setActiveTab] = useState<'grid' | 'dashboard'>('grid');
    const [selectedCell, setSelectedCell] = useState<{ x: number, y: number } | null>(null);

    const handleCellClick = (x: number, y: number) => {
        setSelectedCell({ x, y });
    };

    const handleCloseModal = () => {
        setSelectedCell(null);
    };

    return (
        <div className="relative flex flex-col h-screen overflow-hidden bg-[#050510] text-white">
            {/* Ambient background glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-700/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-700/10 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            {/* Game Navbar / Header */}
            <div className="fixed top-0 left-0 right-0 z-[60]">
                <LandingNavbar />
            </div>

            <div className="relative flex-1 flex flex-col md:flex-row overflow-hidden pt-20">
                {/* Desktop Sidebar Overlay (Left) */}
                <div className="absolute top-8 left-8 z-30 pointer-events-none hidden md:flex flex-col gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 pointer-events-auto shadow-2xl"
                    >
                        <h1 className="text-2xl font-black italic uppercase tracking-tighter mb-1">Grid <span className="text-primary">Explorer</span></h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Activity size={12} className="text-green-400" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Network Live</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

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
                    <GridCanvas
                        selectedCell={selectedCell}
                        onCellClick={handleCellClick}
                    />

                    {/* Controls hint */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-4 px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl select-none">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Rotate</span>
                            <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center text-[10px] text-white">L</div>
                        </div>
                        <div className="w-px h-3 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Zoom</span>
                            <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center text-[10px] text-white">S</div>
                        </div>
                        <div className="w-px h-3 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Select</span>
                            <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center text-[10px] text-white">R</div>
                        </div>
                    </div>
                </div>

                {/* Player Dashboard Column */}
                <div className={`md:w-[400px] bg-[#050510]/80 backdrop-blur-3xl border-l border-white/5 relative z-20 overflow-y-auto ${activeTab === 'dashboard' ? 'flex flex-col flex-1' : 'hidden md:flex flex-col'}`}>
                    <PlayerDashboard />
                </div>
            </div>

            {/* Territory Modal */}
            <AnimatePresence mode="wait">
                {selectedCell && (
                    <TerritoryModal
                        key={`${selectedCell.x}-${selectedCell.y}`}
                        x={selectedCell.x}
                        y={selectedCell.y}
                        onClose={handleCloseModal}
                    />
                )}
            </AnimatePresence>

            {/* Subtle Overlay Lines */}
            <div className="fixed inset-0 pointer-events-none border-[40px] border-[#050510] z-40 hidden md:block opacity-50" />
        </div>
    );
}
