'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export interface Listing {
    id: string;
    territory_id: string;
    x: number;
    y: number;
    block_type: 'standard' | 'border' | 'capital' | 'corner';
    revenue_multiplier: number;
    price: number; // in SOL
    seller_wallet: string;
    listed_at: string;
    status: 'active' | 'sold' | 'cancelled';
    // Add optional territory object for backward compatibility with MarketplacePanel
    territory?: {
        x_coordinate: number;
        y_coordinate: number;
        block_type: string;
    };
}

export interface MarketStats {
    volume24h: number;
    totalTrades: number;
    avgPrice: number;
    activeListings: number;
}

export function useMarketplace() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [stats, setStats] = useState<MarketStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({ type: 'all', sort: 'newest' });

    const fetchListings = async () => {
        setIsLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockListings: Listing[] = [
                {
                    id: '1',
                    territory_id: 't-101',
                    x: 18,
                    y: 23,
                    block_type: 'standard',
                    revenue_multiplier: 1.0,
                    price: 2.5,
                    seller_wallet: '9oNB...ZVi9',
                    listed_at: new Date(Date.now() - 3600000 * 2).toISOString(),
                    status: 'active',
                    territory: { x_coordinate: 18, y_coordinate: 23, block_type: 'standard' }
                },
                {
                    id: '2',
                    territory_id: 't-105',
                    x: 25,
                    y: 30,
                    block_type: 'border',
                    revenue_multiplier: 1.2,
                    price: 1.8,
                    seller_wallet: 'AGch...Xy7z',
                    listed_at: new Date(Date.now() - 3600000 * 5).toISOString(),
                    status: 'active',
                    territory: { x_coordinate: 25, y_coordinate: 30, block_type: 'border' }
                },
                {
                    id: '3',
                    territory_id: 't-202',
                    x: 12,
                    y: 45,
                    block_type: 'capital',
                    revenue_multiplier: 2.5,
                    price: 10.5,
                    seller_wallet: '7xKL...p9Qr',
                    listed_at: new Date(Date.now() - 3600000 * 24).toISOString(),
                    status: 'active',
                    territory: { x_coordinate: 12, y_coordinate: 45, block_type: 'capital' }
                },
                {
                    id: '4',
                    territory_id: 't-303',
                    x: 42,
                    y: 15,
                    block_type: 'standard',
                    revenue_multiplier: 1.0,
                    price: 0.8,
                    seller_wallet: '3mJK...y2wX',
                    listed_at: new Date(Date.now() - 3600000 * 1).toISOString(),
                    status: 'active',
                    territory: { x_coordinate: 42, y_coordinate: 15, block_type: 'standard' }
                },
                {
                    id: '5',
                    territory_id: 't-404',
                    x: 8,
                    y: 8,
                    block_type: 'corner',
                    revenue_multiplier: 3.0,
                    price: 15.0,
                    seller_wallet: 'Bv8H...n4pL',
                    listed_at: new Date(Date.now() - 60000).toISOString(),
                    status: 'active',
                    territory: { x_coordinate: 8, y_coordinate: 8, block_type: 'corner' }
                },
                {
                    id: '6',
                    territory_id: 't-505',
                    x: 55,
                    y: 12,
                    block_type: 'border',
                    revenue_multiplier: 1.5,
                    price: 3.2,
                    seller_wallet: 'Dk4J...m7kP',
                    listed_at: new Date(Date.now() - 3600000 * 12).toISOString(),
                    status: 'active',
                    territory: { x_coordinate: 55, y_coordinate: 12, block_type: 'border' }
                }
            ];

            const mockStats: MarketStats = {
                volume24h: 750.4,
                totalTrades: 1420,
                avgPrice: 1.2,
                activeListings: 245
            };

            setListings(mockListings);
            setStats(mockStats);
        } catch (error) {
            console.error('Failed to fetch marketplace data:', error);
            toast.error('Failed to load marketplace data');
        } finally {
            setIsLoading(false);
        }
    };

    // Mock data for initial implementation
    useEffect(() => {
        fetchListings();
    }, []);

    const buyTerritory = async (listingId: string) => {
        const toastId = toast.loading('Processing purchase...');
        try {
            // Simulate transaction
            await new Promise(resolve => setTimeout(resolve, 3000));

            setListings(prev => prev.filter(l => l.id !== listingId));
            toast.success('Purchase successful! Territory added to your empire.', { id: toastId });
            return true;
        } catch (error) {
            toast.error('Transaction failed. Please try again.', { id: toastId });
            return false;
        }
    };

    return {
        listings,
        stats,
        isLoading,
        filters,
        setFilters,
        fetchListings,
        buyTerritory
    };
}
