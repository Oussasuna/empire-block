export const NETWORK_CONFIG = {
    mainnet: {
        name: 'mainnet-beta' as const,
        rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY || ''}`,
        bundlrAddress: 'https://node1.bundlr.network',
        explorerUrl: 'https://solscan.io',
    },
    devnet: {
        name: 'devnet' as const,
        rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
        bundlrAddress: 'https://devnet.bundlr.network',
        explorerUrl: 'https://solscan.io?cluster=devnet',
    }
};

export function getNetworkConfig() {
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet';
    return NETWORK_CONFIG[network as keyof typeof NETWORK_CONFIG] || NETWORK_CONFIG.mainnet;
}

export function isMainnet(): boolean {
    return process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet';
}

export function getExplorerUrl(signature: string): string {
    const config = getNetworkConfig();
    return `${config.explorerUrl}/tx/${signature}`;
}
