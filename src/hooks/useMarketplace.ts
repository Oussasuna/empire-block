'use client';

import { useMemo, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { useGameProgram } from '@/components/program/game';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMappedCoordinates } from '@/hooks/useMappedCoordinates';

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
    landPubkey: PublicKey;
    date: BN;
}

export interface MarketStats {
    volume24h: number;
    totalTrades: number;
    avgPrice: number;
    activeListings: number;
}

export function useMarketplace() {
    const { publicKey } = useWallet();
    const {
        allListings,
        allLands,
        buyLand,
        listLand: listLandMutation,
        cancelList: cancelListMutation,
        editList: editListMutation
    } = useGameProgram();
    const { mappedCoords } = useMappedCoordinates();

    const [filters, setFilters] = useState({ type: 'all', sort: 'newest' });

    const listings = useMemo(() => {
        if (!allListings.data || !allLands.data) return [];

        return allListings.data.filter(w => w.account.isActive).map(listingWrapper => {
            const list = listingWrapper.account;
            // Find corresponding land to get coordinates and type by numeric ID
            const landWrapper = allLands.data?.find(l => l.account.id.toString() === list.landId.toString());
            const land = landWrapper?.account;

            const landStrId = land ? land.id.toString() : list.landId.toString();
            const coord = mappedCoords.get(landStrId);
            const x = coord?.x ?? 0;
            const y = coord?.y ?? 0;

            let type: Listing['block_type'] = 'standard';
            if (land?.territoryType?.capital) type = 'capital';
            else if (land?.territoryType?.corner) type = 'corner';
            else if (land?.territoryType?.border) type = 'border';

            return {
                id: listingWrapper.publicKey.toBase58(),
                territory_id: list.landId.toString(),
                x,
                y,
                block_type: type,
                revenue_multiplier: 1.0,
                price: list.price.toNumber() / 1e9, // lamports to SOL
                seller_wallet: list.seller.toBase58(),
                listed_at: list.timestamp ? new Date(list.timestamp.toNumber()).toISOString() : new Date().toISOString(), // On-chain usually doesn't store this unless added
                status: 'active' as const,
                territory: { x_coordinate: x, y_coordinate: y, block_type: type },
                landPubkey: landWrapper?.publicKey || PublicKey.default,
                date: list.timestamp || new BN(0)
            };
        }).filter(l => {
            if (filters.type === 'all') return true;
            return l.block_type === filters.type;
        }).sort((a, b) => {
            if (filters.sort === 'price-low') return a.price - b.price;
            if (filters.sort === 'price-high') return b.price - a.price;
            return 0; // default newest (id based or similar)
        });
    }, [allListings.data, allLands.data, filters]);

    const stats: MarketStats = useMemo(() => {
        const activeCount = listings.length;
        const totalVolume = listings.reduce((acc, curr) => acc + curr.price, 0);
        return {
            volume24h: totalVolume, // Mocking volume for now
            totalTrades: 124, // Mock
            avgPrice: activeCount > 0 ? totalVolume / activeCount : 0,
            activeListings: activeCount
        };
    }, [listings]);

    // ── Activity feed: inactive (purchased) listing PDAs ───────────────────────
    const activity = useMemo(() => {
        if (!allListings.data || !allLands.data) return [];
        return allListings.data
            .filter(w => !w.account.isActive)
            .map(w => {
                const list = w.account;
                const landWrapper = allLands.data?.find(l => l.account.id.toString() === list.landId.toString());
                const land = landWrapper?.account;
                
                const landStrId = land ? land.id.toString() : list.landId.toString();
                const coord = mappedCoords.get(landStrId);
                const x = coord?.x ?? 0;
                const y = coord?.y ?? 0;

                let blockType = 'standard';
                if (land?.territoryType?.capital) blockType = 'capital';
                else if (land?.territoryType?.corner) blockType = 'corner';
                else if (land?.territoryType?.border) blockType = 'border';

                return {
                    id: w.publicKey.toBase58(),
                    landId: list.landId.toString(),
                    seller: list.seller.toBase58(),
                    buyer: list.buyer.toBase58(),
                    price: list.price.toNumber() / 1e9,
                    timestamp: list.timestamp ? list.timestamp.toNumber() * 1000 : 0,
                    x,
                    y,
                    blockType,
                };
            })
            .sort((a: { timestamp: number }, b: { timestamp: number }) => b.timestamp - a.timestamp);
    }, [allListings.data, allLands.data]);

    const buyTerritory = async (listing: Listing) => {
        try {
            const sellerPublicKey = new PublicKey(listing.seller_wallet);
            const listingPublicKey = new PublicKey(listing.id);
            await buyLand.mutateAsync({ land: listing.landPubkey, seller: sellerPublicKey, listing: listingPublicKey });
            return true;
        } catch (error) {
            console.error('Buy territory failed:', error);
            return false;
        }
    };

    const listLand = async (land: PublicKey, price: number) => {
        try {
            const lamports = new BN(price * 1e9);
            await listLandMutation.mutateAsync({ land, price: lamports });
            return true;
        } catch (error) {
            console.error('List land failed:', error);
            return false;
        }
    };

    const cancelList = async (land: PublicKey) => {
        try {
            console.log(land.toBase58())
            console.log(listings)
            const listing = listings.find(l => l.landPubkey.toBase58() === land.toBase58());
            if (!listing) throw new Error("Listing not found");
            const listingPublicKey = new PublicKey(listing.id);
            await cancelListMutation.mutateAsync({ land, listing: listingPublicKey });
            return true;
        } catch (error) {
            console.error('Cancel listing failed:', error);
            return false;
        }
    };

    const editList = async (land: PublicKey, newPrice: number) => {
        try {
            const lamports = new BN(newPrice * 1e9);
            const listing = listings.find(l => l.landPubkey.toBase58() === land.toBase58());
            if (!listing) throw new Error("Listing not found");
            const listingPublicKey = new PublicKey(listing.id);
            await editListMutation.mutateAsync({ land, newPrice: lamports, listing: listingPublicKey });
            return true;
        } catch (error) {
            console.error('Edit listing failed:', error);
            return false;
        }
    };

    return {
        listings,
        stats,
        activity,
        isLoading: allListings.isLoading || allLands.isLoading,
        isActivityLoading: allListings.isLoading || allLands.isLoading,
        filters,
        setFilters,
        fetchListings: () => {
            allListings.refetch();
            allLands.refetch();
        },
        buyTerritory,
        listLand,
        cancelList,
        editList
    };
}

