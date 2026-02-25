'use client';

import React from 'react';

export const LiveActivityTicker = () => {
    const activities = [
        { icon: "⚔️", name: "CryptoKing", action: "claimed (12,7)", price: "0.3 SOL", color: "text-cyan" },
        { icon: "🛡️", name: "Warrior DAO", action: "attacked (25,30)", result: "Victory!", color: "text-green-400" },
        { icon: "👑", name: "SolEmpire", action: "formed a 15-block empire", bonus: "+42% bonus", color: "text-primary" },
        { icon: "💰", name: "DegenerateUnit", action: "sold territory (4,19)", price: "1.2 SOL", color: "text-green-400" },
        { icon: "📈", name: "GridLord", action: "expanded to 22 territories", color: "text-cyan" },
        { icon: "⚔️", name: "Battle for (10,10)", action: "resolved", result: "Defender wins", color: "text-red-400" }
    ];

    return (
        <section className="bg-[#0A0A0A] border-y border-white/5 overflow-hidden py-4 flex items-center relative z-20">
            {/* Label */}
            <div className="flex-shrink-0 bg-[#0A0A0A] px-6 py-1 flex items-center gap-3 border-r border-white/10 z-10 relative">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse border-2 border-red-500/30" />
                <span className="text-sm font-black text-white tracking-widest uppercase italic">LIVE</span>
            </div>

            {/* Marquee Content */}
            <div className="flex whitespace-nowrap overflow-hidden relative">
                <div className="flex animate-marquee gap-10">
                    {[...activities, ...activities, ...activities].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 px-2">
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-bold text-white transition-colors hover:text-primary cursor-default">{item.name}</span>
                            <span className="text-gray-400 font-medium">
                                {item.action}
                                {item.price && <span className="text-green-400 ml-2">for {item.price}</span>}
                                {item.result && <span className="text-cyan ml-2">— {item.result}</span>}
                                {item.bonus && <span className="text-primary ml-2">— {item.bonus}</span>}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fade Edges */}
            <div className="absolute left-24 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0A0A0A] to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none z-10" />
        </section>
    );
};
