'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, LayoutGrid, Crown, Coins } from 'lucide-react';

export const HowItWorks = () => {
    return (
        <section className="py-32 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-xs font-bold text-primary uppercase tracking-[0.4em] mb-4 block"
                    >
                        How It Works
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-black text-white mb-6"
                    >
                        Three Steps to Domination
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-custom text-lg max-w-2xl mx-auto"
                    >
                        No experience needed. Just a Solana wallet and ambition.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    <StepCard
                        number="01"
                        title="Claim Territory"
                        body="Buy land on the 50×50 grid. Each square is an NFT you truly own. Strategic positions offer better revenue multipliers."
                        badge="Starting at 0.1 SOL →"
                        color="border-primary"
                        textColor="text-primary"
                        icon={<LayoutGrid className="text-primary" size={32} />}
                        delay={0.1}
                    />
                    <StepCard
                        number="02"
                        title="Build Empires"
                        body="Connect adjacent territories to form empires. Bigger empires earn up to +50% bonus revenue from all game activity."
                        badge="Up to 50% bonus ↗"
                        color="border-secondary"
                        textColor="text-secondary"
                        icon={<Crown className="text-secondary" size={32} />}
                        delay={0.2}
                    />
                    <StepCard
                        number="03"
                        title="Earn Revenue"
                        body="Receive passive SOL from every territory sale in the game. Battle neighbors to expand your empire and increase earnings."
                        badge="Passive income daily ♾"
                        color="border-accent"
                        textColor="text-accent"
                        icon={<Coins className="text-accent" size={32} />}
                        delay={0.3}
                    />

                    {/* Glowing Arrows between cards (Desktop only) */}
                    <div className="hidden md:block absolute top-1/2 left-[30%] -translate-y-1/2 text-secondary/30 animate-pulse">
                        <ArrowRight size={40} strokeWidth={1} />
                    </div>
                    <div className="hidden md:block absolute top-1/2 left-[64%] -translate-y-1/2 text-accent/30 animate-pulse">
                        <ArrowRight size={40} strokeWidth={1} />
                    </div>
                </div>
            </div>
        </section>
    );
};

const StepCard = ({ number, title, body, badge, color, textColor, icon, delay }: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6 }}
            whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            className={`relative glass-card p-10 group hover-lift border-l-[3px] ${color} h-full transition-all duration-500 hover:bg-white/[0.03] hover:border-opacity-100 border-opacity-30 cursor-pointer hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]`}
        >
            <div className={`absolute top-6 right-10 text-7xl font-black ${textColor} opacity-10 select-none group-hover:opacity-25 group-hover:scale-110 transition-all duration-500`}>
                {number}
            </div>

            <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:border-current/50 transition-all duration-500`}>
                    {icon}
                </div>

                <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tight group-hover:translate-x-1 transition-transform duration-500">{title}</h3>
                <p className="text-gray-custom leading-relaxed mb-8 text-sm group-hover:text-gray-300 transition-colors duration-500">
                    {body}
                </p>

                <div className={`inline-flex px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold ${textColor} uppercase tracking-wider group-hover:bg-white/10 transition-colors duration-500`}>
                    {badge}
                </div>
            </div>
        </motion.div>
    );
};
