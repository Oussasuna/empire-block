'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export const CommunityStats = () => {
    return (
        <section className="py-32 relative overflow-hidden bg-black">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-black text-white mb-6"
                    >
                        Trusted by Thousands of Players
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-custom text-lg max-w-2xl mx-auto"
                    >
                        Scaling the largest on-chain strategy game on Solana
                    </motion.p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <CounterStat
                        target={2500}
                        label="Players"
                        suffix="+"
                        borderColor="border-t-primary"
                        delay={0.1}
                    />
                    <CounterStat
                        target={15}
                        label="Transactions"
                        suffix="K+"
                        borderColor="border-t-secondary"
                        delay={0.2}
                    />
                    <CounterStat
                        target={500}
                        label="SOL Volume"
                        borderColor="border-t-accent"
                        delay={0.3}
                    />
                    <CounterStat
                        target={98}
                        label="Uptime"
                        suffix="%"
                        borderColor="border-t-green-500"
                        delay={0.4}
                    />
                </div>
            </div>
        </section>
    );
};

const CounterStat = ({ target, label, suffix = "", borderColor, delay }: any) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps approx

            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    setCount(target);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [isInView, target]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6 }}
            className={`glass-card p-10 text-center border-t-2 ${borderColor} hover-lift group`}
        >
            <div className={`text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter group-hover:scale-110 transition-transform`}>
                {count}{suffix}
            </div>
            <div className="text-xs font-bold text-gray-custom uppercase tracking-[0.3em]">{label}</div>
        </motion.div>
    );
};
