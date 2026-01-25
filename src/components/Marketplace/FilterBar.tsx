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
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
            {/* Filter Tabs */}
            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 overflow-x-auto max-w-full no-scrollbar">
                {types.map((type) => (
                    <button
                        key={type}
                        onClick={() => onTypeChange(type)}
                        className={`
                            px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all duration-200 whitespace-nowrap
                            ${activeType === type
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'}
                        `}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Sort & Search Container */}
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search coordinates..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all placeholder:text-gray-500"
                    />
                </div>

                <div className="relative group">
                    <button className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-gray-300 flex items-center gap-3 hover:bg-white/10 transition-all">
                        Sort: {activeSort}
                        <ChevronDown size={16} className="text-gray-500" />
                    </button>
                    {/* Dropdown would go here - simplified for now */}
                </div>
            </div>
        </div>
    );
}
