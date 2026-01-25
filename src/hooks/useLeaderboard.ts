'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export interface LeaderboardEntry {
    rank: number;
    wallet_address: string;
    username?: string;
    avatar_url?: string;
    total_territories: number;
    total_revenue: number;
    largest_empire: number;
    battles_won: number;
    battles_lost: number;
    win_rate: number;
}

export type LeaderboardTab = 'players' | 'empires' | 'battles';

export function useLeaderboard() {
    const [activeTab, setActiveTab] = useState<LeaderboardTab>('players');
    const [data, setData] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setIsLoading(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));

                const mockData: LeaderboardEntry[] = Array.from({ length: 20 }).map((_, i) => ({
                    rank: i + 1,
                    wallet_address: `${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
                    username: i === 0 ? 'EmpireKing' : i === 1 ? 'SolMaster' : i === 2 ? 'GridLord' : undefined,
                    total_territories: Math.floor(Math.random() * 100) + (20 - i) * 5,
                    total_revenue: parseFloat((Math.random() * 50 + (20 - i) * 2).toFixed(2)),
                    largest_empire: Math.floor(Math.random() * 10) + (20 - i),
                    battles_won: Math.floor(Math.random() * 30),
                    battles_lost: Math.floor(Math.random() * 10),
                    win_rate: 0 // Will be calculated
                })).map(entry => ({
                    ...entry,
                    win_rate: entry.battles_won + entry.battles_lost > 0
                        ? (entry.battles_won / (entry.battles_won + entry.battles_lost)) * 100
                        : 0
                }));

                // Sort based on active tab
                const sortedData = [...mockData].sort((a, b) => {
                    if (activeTab === 'players') return b.total_territories - a.total_territories;
                    if (activeTab === 'empires') return b.largest_empire - a.largest_empire;
                    return b.win_rate - a.win_rate;
                }).map((item, idx) => ({ ...item, rank: idx + 1 }));

                setData(sortedData);
            } catch (error) {
                toast.error('Failed to load leaderboard');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, [activeTab]);

    return {
        activeTab,
        setActiveTab,
        data,
        isLoading,
        searchQuery,
        setSearchQuery
    };
}
