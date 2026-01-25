'use client';

import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

require('@solana/wallet-adapter-react-ui/styles.css');

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    // Determine network from environment variable
    const networkEnv = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
    const network = networkEnv === 'mainnet'
        ? WalletAdapterNetwork.Mainnet
        : WalletAdapterNetwork.Devnet;

    // Use custom RPC URL if provided, otherwise use default cluster URL
    const endpoint = useMemo(() => {
        const customRpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
        if (customRpcUrl) {
            return customRpcUrl;
        }
        return clusterApiUrl(network);
    }, [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
