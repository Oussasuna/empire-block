'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Crown, Twitter, Github, Disc as Discord } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';

export const CTABanner = () => {
    return (
        <section className="py-24 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-primary via-blue-600 to-secondary p-12 md:p-20 text-center shadow-[0_0_100px_rgba(124,58,237,0.3)]"
                >
                    {/* Grid Overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                    />

                    {/* Floating Glows */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/20 blur-[100px] rounded-full" />
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/30 blur-[100px] rounded-full" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight">
                            Ready to Build <br /> Your Empire?
                        </h2>
                        <p className="text-xl text-white/80 leading-relaxed font-medium">
                            Join thousands of players conquering the grid. Start with just 0.1 SOL and build your legacy today.
                        </p>

                        <div className="flex flex-col items-center gap-6 pt-4">
                            <div className="wallet-adapter-dropdown">
                                <WalletMultiButton className="!bg-[#0A0A0A] !text-white hover:!bg-black !transition-all !rounded-full !h-16 !px-12 !text-xl !font-black !border-none shadow-2xl" />
                            </div>
                            <div className="flex items-center gap-8 text-white/60 text-sm font-bold tracking-widest uppercase italic">
                                <span>No signup required</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                                <span>Instant gameplay</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                                <span>Powered by Solana</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export const LandingFooter = () => {
    return (
        <footer className="bg-[#050508] border-t border-white/5 py-16 relative overflow-hidden">
            {/* Subtle bottom glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[1.5fr,1fr,1fr] gap-12 items-start">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
                            <Crown className="text-primary" size={24} />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-white tracking-tight">EMPIRE BLOCKS</span>
                            <div className="text-[10px] font-bold text-primary/60 uppercase tracking-widest leading-none mt-1">Conquer the Grid</div>
                        </div>
                    </div>
                    <p className="text-gray-custom text-sm leading-relaxed max-w-sm">
                        The definitive on-chain strategy game for the Solana ecosystem. Build, battle, and earn in a persistent digital world.
                    </p>
                    <div className="flex items-center gap-4">
                        <SocialLink icon={<Twitter size={18} />} href="#" />
                        <SocialLink icon={<Discord size={18} />} href="#" />
                        <SocialLink icon={<Github size={18} />} href="#" />
                    </div>
                </div>

                <div className="space-y-6">
                    <h4 className="text-white font-black uppercase text-xs tracking-[0.3em] italic">Product</h4>
                    <ul className="space-y-4 text-sm font-bold text-gray-custom">
                        <li><FooterLink href="#grid">Grid Explorer</FooterLink></li>
                        <li><FooterLink href="#marketplace">Marketplace</FooterLink></li>
                        <li><FooterLink href="#leaderboard">Global Standings</FooterLink></li>
                        <li><FooterLink href="#docs">Documentation</FooterLink></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="text-white font-black uppercase text-xs tracking-[0.3em] italic">Legal</h4>
                    <ul className="space-y-4 text-sm font-bold text-gray-custom">
                        <li><FooterLink href="#">Privacy Policy</FooterLink></li>
                        <li><FooterLink href="#">Terms of Service</FooterLink></li>
                        <li><FooterLink href="#">Cookie Policy</FooterLink></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-xs font-bold text-gray-custom tracking-widest uppercase">
                    Empire Blocks © 2024 — <span className="text-white">Built on Solana</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Network Status: <span className="text-white">Operational</span>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ icon, href }: any) => (
    <motion.a
        href={href}
        whileHover={{ scale: 1.15, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-custom hover:text-white hover:border-primary/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all"
    >
        {icon}
    </motion.a>
);

const FooterLink = ({ href, children }: any) => (
    <a href={href} className="hover:text-primary transition-colors">
        {children}
    </a>
);
