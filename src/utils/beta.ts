/**
 * Network Utilities
 * Helper functions for network mode detection and transaction handling
 */

/**
 * Check if the app is running in beta mode
 * Always false for production
 */
export const isBetaMode = (): boolean => {
    return false;
};

/**
 * Get the current network label
 */
export const getNetworkLabel = (): string => {
    return 'Mainnet';
};

/**
 * Get Solana Explorer URL for a transaction signature
 * @param signature - Transaction signature
 * @returns Explorer URL
 */
export const getExplorerUrl = (signature: string): string => {
    return `https://explorer.solana.com/tx/${signature}`;
};

/**
 * Get Solana Explorer URL for an address
 * @param address - Wallet or program address
 * @returns Explorer URL
 */
export const getExplorerAddressUrl = (address: string): string => {
    return `https://explorer.solana.com/address/${address}`;
};

// Faucet URL helper removed as it's not needed in Mainnet

