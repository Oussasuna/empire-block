'use client';

import { useLeaderboard, LeaderboardTab } from '@/hooks/useLeaderboard';
import Podium from '@/components/Leaderboard/Podium';
import RankingsTable from '@/components/Leaderboard/RankingsTable';
import StatsCards from '@/components/Leaderboard/StatsCards';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Search, ChevronRight } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function LeaderboardPage() {
    const { publicKey } = useWallet();
    const {
        activeTab,
        setActiveTab,
        data,
        isLoading,
        searchQuery,
        setSearchQuery
    } = useLeaderboard();

    const tabs: { id: LeaderboardTab; label: string; icon: string }[] = [
        { id: 'players', label: 'Top Players', icon: '👑' },
        { id: 'empires', label: 'Strongest Empires', icon: '🏰' },
        { id: 'battles', label: 'Battle Records', icon: '⚔️' }
    ];

    const filteredData = data.filter(entry =>
        entry.wallet_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0A0E27] text-white py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col items-center mb-16 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 border border-yellow-500/20"
                    >
                        <Trophy className="text-yellow-500" size={32} />
                    </motion.div>
                    <h1 className="text-5xl font-black tracking-tighter mb-4 text-gradient-primary">Leaderboard</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-sm">Rule the Grid - Top Emperors</p>
                </div>

                {/* Podium Section */}
                {!isLoading && data.length >= 3 && <Podium topThree={data.slice(0, 3)} />}

                {/* Controls Section */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-8">
                    {/* Tab Navigation */}
                    <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 w-full md:w-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2
                                    ${activeTab === tab.id
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                        : 'text-gray-500 hover:text-white hover:bg-white/5'}
                                `}
                            >
                                <span className="hidden md:inline">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Find an emperor..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                        />
                    </div>
                </div>

                {/* Stats Highlights */}
                <StatsCards topPlayer={data[0]} />

                {/* Main Rankings Table */}
                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse border border-white/10" />
                        ))}
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <RankingsTable
                                data={filteredData}
                                currentWallet={publicKey?.toString()}
                            />
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* Pagination Placeholder */}
                <div className="mt-12 flex justify-center">
                    <button className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                        Load More Emperors
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
