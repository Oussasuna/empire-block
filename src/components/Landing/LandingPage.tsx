'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Crown, Swords, Coins, ArrowRight, TrendingUp, Check, Zap,
    BarChart3, Shield, Trophy, Sparkles
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Dynamic import for the 3D grid preview to avoid SSR issues
const GridCanvas = dynamic(() => import('@/components/Grid/GridCanvas'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#0A0E27] animate-shimmer rounded-2xl" />
});

export default function LandingPage() {
    const [mounted, setMounted] = useState(false);
    const [currentActivity, setCurrentActivity] = useState(0);

    const activities = [
        { id: 1, user: 'Empire Alpha', territory: '18,23', amount: '0.1', time: '2s ago' },
        { id: 2, user: 'Warrior DAO', territory: '25,30', amount: '0.2', time: '15s ago' },
        { id: 3, user: 'SOL Knights', territory: '12,8', amount: '0.15', time: '28s ago' },
    ];

    useEffect(() => {
        setMounted(true);

        // Rotate activities every 5 seconds
        const interval = setInterval(() => {
            setCurrentActivity((prev) => (prev + 1) % activities.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8 z-10"
                    >


                        {/* Headline */}
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
                                Build Your<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                                    Empire
                                </span><br />
                                on Chain
                            </h1>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                Conquer territories, earn passive SOL revenue, and battle for
                                supremacy in a 50×50 persistent world.
                            </p>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {mounted ? (
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-40 group-hover:opacity-75 transition duration-200" />
                                    <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-purple-700 hover:!to-blue-700 !h-[56px] !px-8 !rounded-xl !text-lg !font-bold hover:!scale-105 transition-all !shadow-xl" />
                                </div>
                            ) : (
                                <div className="h-[56px] w-[200px] glass-card rounded-xl animate-shimmer" />
                            )}
                            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-bold text-lg transition-all duration-200">
                                View Docs
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                            <div>
                                <div className="text-3xl font-black text-white mb-1">2.5K+</div>
                                <div className="text-sm text-gray-400 font-semibold">Territories</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-white mb-1">145</div>
                                <div className="text-sm text-gray-400 font-semibold">Active Empires</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-white mb-1">500+</div>
                                <div className="text-sm text-gray-400 font-semibold">SOL Volume</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - 3D Grid */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-2xl overflow-hidden border neon-border-secondary shadow-2xl shadow-cyan-500/20 bg-gradient-to-br from-gray-900 to-black relative">
                            {/* Grid Canvas */}
                            <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
                                <GridCanvas selectedCell={null} />
                            </div>

                            {/* Activity Toast - Modernized Premium Version */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentActivity}
                                    initial={{ y: 20, opacity: 0, scale: 0.95 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    exit={{ y: -20, opacity: 0, scale: 0.95 }}
                                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                                    className="absolute bottom-8 left-8 right-8 max-w-md mx-auto"
                                >
                                    <div className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 shadow-2xl shadow-cyan-500/10">
                                        {/* Glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-blue-500/10 rounded-2xl blur-xl" />

                                        <div className="relative flex items-center gap-4">
                                            {/* Icon with animated border */}
                                            <div className="relative flex-shrink-0">
                                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl blur-md opacity-75" />
                                                <div className="relative w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center border border-purple-400/30">
                                                    <Crown className="text-white" size={26} />
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-bold text-base mb-1 truncate">
                                                    {activities[currentActivity].user}
                                                </p>
                                                <p className="text-gray-400 text-sm">
                                                    Minted territory <span className="text-cyan-400 font-mono">({activities[currentActivity].territory})</span>
                                                </p>
                                            </div>

                                            {/* Amount & Time */}
                                            <div className="flex-shrink-0 text-right">
                                                <p className="text-green-400 font-bold text-lg mb-0.5 flex items-center gap-1 justify-end">
                                                    <TrendingUp size={16} />
                                                    +{activities[currentActivity].amount}
                                                </p>
                                                <p className="text-gray-500 text-xs font-mono">
                                                    {activities[currentActivity].time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Docs Section Placeholder */}
            <section id="docs" className="container mx-auto px-4 py-20 border-t border-white/5">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-gradient-primary mb-4 uppercase italic">Documentation</h2>
                    <p className="text-gray-400 text-lg font-bold uppercase tracking-widest">Everything you need to know about Empire Blocks</p>
                </div>

                <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-12 text-center shadow-2xl">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-primary/20">
                        <Sparkles className="text-primary" size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4">Coming Soon</h3>
                    <p className="text-gray-400 leading-relaxed mb-8">
                        Our comprehensive documentation is currently being finalized. Check back soon for detailed guides on gameplay, territory economics, and battle strategies.
                    </p>
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/20 border border-primary/30 rounded-xl text-primary text-xs font-black uppercase tracking-widest animate-pulse">
                        Updating Systems...
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="grid md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={<BarChart3 className="text-blue-400" size={24} />}
                        title="Live Market Data"
                        description="Track territory values, empire formations, and trading volume in real-time."
                        gradient="from-blue-900/20 to-cyan-900/20"
                        border="neon-border-secondary"
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={<Shield className="text-purple-400" size={24} />}
                        title="Battle System"
                        description="Challenge neighbors to strategic battles and expand your territory through conquest."
                        gradient="from-purple-900/20 to-pink-900/20"
                        border="neon-border-primary"
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<Trophy className="text-yellow-400" size={24} />}
                        title="Leaderboards"
                        description="Compete for the largest empire and highest revenue. Top players earn exclusive rewards."
                        gradient="from-red-900/20 to-orange-900/20"
                        border="neon-border-accent"
                        delay={0.3}
                    />
                </div>
            </section>

            {/* Social Proof Section */}
            <section className="container mx-auto px-4 py-20 border-t border-white/10">
                <div className="text-center">
                    <h2 className="text-3xl font-black text-white mb-12">Join the Community</h2>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                        <StatItem value="2,500+" label="Players" />
                        <StatItem value="15K+" label="Transactions" />
                        <StatItem value="500 SOL" label="Volume" />
                        <StatItem value="98%" label="Uptime" />
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, white 20px, white 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, white 20px, white 21px)',
                        }} />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                            Ready to Build Your Empire?
                        </h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of players conquering the grid. Start with just 0.1 SOL.
                        </p>
                        {mounted ? (
                            <div className="inline-block">
                                <WalletMultiButton className="!bg-white !text-purple-600 hover:!bg-gray-100 !h-[60px] !px-10 !rounded-xl !text-xl !font-black hover:!scale-105 transition-all !shadow-2xl" />
                            </div>
                        ) : (
                            <div className="h-[60px] w-[250px] bg-white/20 rounded-xl animate-shimmer mx-auto" />
                        )}
                        <p className="text-white/70 text-sm mt-6 font-semibold">
                            No signup required • Instant gameplay
                        </p>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description, gradient, border, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className={`bg-gradient-to-br ${gradient} rounded-2xl p-8 border ${border} hover:scale-105 transition-all duration-300 group`}
        >
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-black text-white mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{description}</p>
        </motion.div>
    );
}

function StatItem({ value, label }: { value: string; label: string }) {
    return (
        <div className="text-center">
            <div className="text-4xl font-black text-white mb-2">{value}</div>
            <div className="text-gray-400 font-semibold">{label}</div>
        </div>
    );
}
