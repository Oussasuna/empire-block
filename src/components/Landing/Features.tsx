'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Swords, Trophy } from 'lucide-react';

export const Features = () => {
    return (
        <section id="features" className="py-32 bg-[#050508] relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-xs font-bold text-secondary uppercase tracking-[0.4em] mb-4 block"
                    >
                        Features
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-black text-white mb-6"
                    >
                        Everything You Need to Conquer
                    </motion.h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<BarChart3 size={32} />}
                        title="Live Market Data"
                        description="Track territory values, empire formations, and trading volume in real-time. Use on-chain data to make strategic moves."
                        glowColor="group-hover:text-primary"
                        iconColor="text-primary"
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={<Swords size={32} />}
                        title="Battle System"
                        description="Challenge neighbors to strategic battles and expand your territory through conquest. High-stakes on-chain combat logic."
                        glowColor="group-hover:text-red-500"
                        iconColor="text-red-500"
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<Trophy size={32} />}
                        title="Leaderboards"
                        description="Compete for the largest empire and highest revenue. Top players earn exclusive rewards and governance power."
                        glowColor="group-hover:text-accent"
                        iconColor="text-accent"
                        delay={0.3}
                    />
                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({ icon, title, description, glowColor, iconColor, delay }: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6 }}
            whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            className="group glass-card p-10 h-full flex flex-col items-center text-center hover-lift border border-white/5 hover:border-white/20 transition-all duration-500 cursor-pointer hover:shadow-[0_20px_50px_rgba(139,92,246,0.2)]"
        >
            <div className={`w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 transition-all duration-500 ${glowColor} group-hover:scale-110 group-hover:border-current/50 shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_40px_currentColor]`}>
                <div className={`${iconColor} transition-colors group-hover:drop-shadow-[0_0_15px_currentColor]`}>
                    {icon}
                </div>
            </div>

            <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tight group-hover:text-white transition-colors">{title}</h3>
            <p className="text-gray-custom leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                {description}
            </p>
        </motion.div>
    );
};
