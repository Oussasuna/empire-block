'use client';

import { motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';

interface FilterBarProps {
    activeType: string;
    onTypeChange: (type: string) => void;
    activeSort: string;
    onSortChange: (sort: string) => void;
}

export default function FilterBar({ activeType, onTypeChange, activeSort, onSortChange }: FilterBarProps) {
    const types = ['all', 'standard', 'border', 'capital', 'corner'];

    return (
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-8">
            {/* Filter Tabs - Persistent horizontal scroll on mobile */}
            <div className="w-full lg:w-auto flex bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto no-scrollbar scroll-smooth">
                <div className="flex gap-1">
                    {types.map((type) => (
                        <button
                            key={type}
                            onClick={() => onTypeChange(type)}
                            className={`
                                px-6 py-3 rounded-lg text-xs md:text-sm font-bold capitalize transition-all duration-200 whitespace-nowrap touch-target-44
                                ${activeType === type
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
                            `}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sort & Search Container */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search coordinates..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all placeholder:text-gray-500"
                    />
                </div>

                <div className="relative group w-full sm:w-auto">
                    <button className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-gray-300 flex items-center justify-between sm:justify-start gap-3 hover:bg-white/10 transition-all">
                        <span className="whitespace-nowrap">Sort: {activeSort}</span>
                        <ChevronDown size={16} className="text-gray-500" />
                    </button>
                    {/* Dropdown would go here - simplified for now */}
                </div>
            </div>
        </div>
    );
}
