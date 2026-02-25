'use client';

import { useLeaderboard, LeaderboardTab } from '@/hooks/useLeaderboard';
import Podium from '@/components/Leaderboard/Podium';
import RankingsTable from '@/components/Leaderboard/RankingsTable';
import StatsCards from '@/components/Leaderboard/StatsCards';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Search, ChevronRight } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { LandingNavbar } from '@/components/Landing/Navbar';
import { LandingFooter } from '@/components/Landing/CTABanner';

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
        (entry.username && entry.username.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#050510] text-white selection:bg-purple-500/30 font-sans">
            <LandingNavbar />

            <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto relative">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-purple-600/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

                {/* Header */}
                <div className="relative z-10 flex flex-col items-center mb-16 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 border border-yellow-500/20 shadow-[0_0_50px_rgba(234,179,8,0.15)] group hover:scale-110 transition-transform duration-300"
                    >
                        <Trophy className="text-yellow-500 group-hover:rotate-12 transition-transform" size={32} />
                    </motion.div>
                    <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-4 uppercase italic">
                        Leader<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#8B5CF6]">board</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs">
                        Rule the Grid <span className="text-gray-600 mx-2">•</span> Top Emperors
                    </p>
                </div>

                {/* Podium Section */}
                {!isLoading && data.length >= 3 && <Podium topThree={data.slice(0, 3)} />}

                {/* Controls Section */}
                <div className="relative z-20 flex flex-col md:flex-row gap-6 justify-between items-center mb-8">
                    {/* Tab Navigation */}
                    <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 w-full md:w-auto backdrop-blur-2xl shadow-2xl">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex-1 md:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2
                                    ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-primary to-[#6D28D9] text-white shadow-[0_8px_20px_rgba(124,58,237,0.3)] scale-105'
                                        : 'text-gray-500 hover:text-white hover:bg-white/5'}
                                `}
                            >
                                <span className="hidden md:inline grayscale opacity-70">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-80 group">
                        <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-primary" size={18} />
                            <input
                                type="text"
                                placeholder="Find an emperor..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all shadow-inner backdrop-blur-md"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Highlights */}
                <div className="relative z-10">
                    <StatsCards topPlayer={data[0]} />
                </div>

                {/* Main Rankings Table */}
                <div className="relative z-10">
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
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                <RankingsTable
                                    data={filteredData}
                                    currentWallet={publicKey?.toString()}
                                />
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>

                {/* Pagination Placeholder */}
                <div className="mt-16 flex justify-center relative z-10 pb-12">
                    <button className="flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-white hover:bg-white/10 transition-all hover:scale-105 shadow-2xl backdrop-blur-md group">
                        Load More Emperors
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
            <LandingFooter />
        </div>
    );
}
