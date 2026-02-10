'use client';

import { isMainnet } from '@/lib/solana/config';

export function NetworkBanner() {
    const mainnet = isMainnet();

    if (mainnet) {
        return null; // Clean look for mainnet
    }

    return (
        <div className="bg-yellow-500/20 border-b border-yellow-500/30 px-4 py-1.5 text-center">
            <span className="text-yellow-400 text-xs font-medium">
                ⚠️ DEVNET - Test mode - Get free SOL at faucet.solana.com
            </span>
        </div>
    );
}
