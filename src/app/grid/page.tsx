'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { LayoutGrid, User, Activity } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Landing Components
import { LandingNavbar } from '@/components/Landing/Navbar';

// Game Components
import PlayerDashboard from '@/components/Dashboard/PlayerDashboard';
import TerritoryModal from '@/components/Territory/TerritoryModal';
import Grid2D from '@/components/Grid/Grid2D';
import { useGrid } from '@/hooks/useGrid';

export default function GridExplorerPage() {
    const { publicKey } = useWallet();
    const [activeTab, setActiveTab] = useState<'grid' | 'dashboard'>('grid');
    const [selectedCell, setSelectedCell] = useState<{ x: number, y: number } | null>(null);
    const { territories, isLoading } = useGrid();

    const handleCellClick = (x: number, y: number) => {
        setSelectedCell({ x, y });
    };

    const handleCloseModal = () => {
        setSelectedCell(null);
    };

    return (
        <div className="relative flex flex-col h-[100dvh] overflow-hidden bg-[#050510] text-white">
            {/* Ambient background glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-700/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-700/10 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            {/* Game Navbar / Header */}
            <div className="fixed top-0 left-0 right-0 z-[60]">
                <LandingNavbar />
            </div>

            {/* Main content area — pt-14 on mobile, pt-20 on desktop */}
            <div className="relative flex-1 flex flex-col md:flex-row overflow-hidden pt-14 md:pt-20">
                {/* Desktop Sidebar Overlay (Left) — hidden on mobile */}
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

                {/* 2D Grid Canvas — takes full remaining height on mobile */}
                <div
                    className={`flex-1 relative z-10 min-h-0 ${
                        activeTab === 'grid' ? 'flex' : 'hidden md:flex'
                    }`}
                    style={{ /* Ensure canvas parent has explicit dimensions */ }}
                >
                    {isLoading ? (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-[#050510]">
                            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <p className="text-primary font-black uppercase tracking-[0.3em] animate-pulse">Loading Grid...</p>
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

                {/* Player Dashboard Column — full screen on mobile when active */}
                <div className={`md:w-[400px] bg-[#050510]/80 backdrop-blur-3xl border-l border-white/5 relative z-20 overflow-y-auto ${
                    activeTab === 'dashboard' ? 'flex flex-col flex-1' : 'hidden md:flex flex-col'
                }`}>
                    <PlayerDashboard />
                </div>
            </div>

            {/* Mobile Tab Switcher — fixed at absolute bottom */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 z-[55] flex p-2 safe-area-bottom">
                <button
                    onClick={() => setActiveTab('grid')}
                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                        activeTab === 'grid'
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-400 active:text-white'
                    }`}
                >
                    <LayoutGrid size={20} />
                    <span className="text-xs font-bold uppercase tracking-wider">Grid</span>
                </button>
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                        activeTab === 'dashboard'
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-400 active:text-white'
                    }`}
                >
                    <User size={20} />
                    <span className="text-xs font-bold uppercase tracking-wider">Base</span>
                </button>
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

            {/* Subtle Overlay Lines — desktop only */}
            <div className="fixed inset-0 pointer-events-none border-[40px] border-[#050510] z-40 hidden md:block opacity-50" />
        </div>
    );
}
