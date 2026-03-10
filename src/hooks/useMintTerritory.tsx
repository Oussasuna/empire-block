'use client';

/**
 * useMintTerritory — thin wrapper around useGameProgram().mintLand
 *
 * Keeps the same public API as the old hook so every consumer component
 * (PlayerDashboard, TerritoryModal, etc.) continues to work untouched.
 *
 * The real on-chain logic lives in:
 *   src/components/program/game.tsx → useGameProgram → mintLand mutation
 */

import { useGameProgram } from '@/components/program/game';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';
import { TREASURY } from '@/components/program/game';

export function useMintTerritory() {
    const anchorWallet = useAnchorWallet();
    const { mintLand, allUserLands, allLands, myProfile } = useGameProgram();

    const isMinting = mintLand.isPending;

    /**
     * mintTerritory — callable from any component.
     * The x/y param is accepted for API compatibility but the current
     * on-chain program assigns coordinates on-chain via the land index.
     * Pass an optional imageUrl to tag the territory with metadata.
     */
    const mintTerritory = async (_x?: number, _y?: number, imageUrl = '') => {
        if (!anchorWallet) {
            toast.error('Please connect your wallet first');
            return null;
        }

        try {
            const tx = await mintLand.mutateAsync({ treasury: TREASURY, imageUrl });
            return tx;
        } catch (err: any) {
            console.error('[useMintTerritory] error', err);
            return null;
        }
    };

    return {
        mintTerritory,
        isMinting,
        // Expose on-chain data so Dashboard + other components can read it
        myLands: allUserLands,
        allLands,
        myProfile,
    };
}
