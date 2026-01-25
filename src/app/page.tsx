'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import PlayerDashboard from '@/components/Dashboard/PlayerDashboard';
import LandingPage from '@/components/Landing/LandingPage';
import { useState, useEffect } from 'react';
import { LayoutGrid, User } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import TerritoryModal from '@/components/Territory/TerritoryModal';

const GridCanvas = dynamic(() => import('@/components/Grid/GridCanvas'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#0A0E27] flex items-center justify-center text-white">Loading Grid...</div>
});

export default function Home() {
    const { connected } = useWallet();
    const [activeTab, setActiveTab] = useState<'grid' | 'dashboard'>('grid');
    const [selectedCell, setSelectedCell] = useState<{ x: number, y: number } | null>(null);

    // Show Landing Page if not connected
    if (!connected) {
        return <LandingPage />;
    }

    const handleCellClick = (x: number, y: number) => {
        console.log('GamePage: Cell clicked', x, y);
        setSelectedCell({ x, y });
    };

    const handleCloseModal = () => {
        console.log('GamePage: Closing modal');
        setSelectedCell(null);
    };

    return (
        <div className="relative h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-black">
            {/* Tab Switcher (Mobile) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0E27] border-t border-white/10 z-30 flex pb-safe">
                <button
                    onClick={() => setActiveTab('grid')}
                    className={`flex-1 py-4 flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'grid'
                        ? 'text-primary'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <LayoutGrid size={20} />
                    <span className="text-xs font-medium">Grid</span>
                </button>
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex-1 py-4 flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'dashboard'
                        ? 'text-primary'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <User size={20} />
                    <span className="text-xs font-medium">Dashboard</span>
                </button>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-[1fr,400px] h-full">
                <div className="relative w-full h-full bg-black/40 z-10">
                    <GridCanvas
                        selectedCell={selectedCell}
                        onCellClick={handleCellClick}
                    />
                </div>
                <div className="bg-[#0A0E27] border-l border-white/10 overflow-y-auto p-6 scrollbar-thin">
                    <PlayerDashboard />
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden h-[calc(100%-64px)]">
                {activeTab === 'grid' ? (
                    <div className="w-full h-full">
                        <GridCanvas
                            selectedCell={selectedCell}
                            onCellClick={handleCellClick}
                        />
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto p-4 pb-20">
                        <PlayerDashboard />
                    </div>
                )}
            </div>

            {/* Territory Modal - Shared for both layouts */}
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

            {/* Debug Info (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed bottom-20 left-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-[100] border border-white/10">
                    <div className="text-primary font-bold mb-1 uppercase tracking-wider">Debug State</div>
                    <div>Selected: {selectedCell ? `(${selectedCell.x}, ${selectedCell.y})` : 'None'}</div>
                </div>
            )}
        </div>
    );
}


