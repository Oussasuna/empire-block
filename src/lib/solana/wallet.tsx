'use client';

import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, useConnection, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { getNetworkConfig, isMainnet } from './config';
import { AnchorProvider } from '@coral-xyz/anchor';

require('@solana/wallet-adapter-react-ui/styles.css');

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const config = getNetworkConfig();

    const network = isMainnet()
        ? WalletAdapterNetwork.Mainnet
        : WalletAdapterNetwork.Mainnet;

    const endpoint = useMemo(() => {
        console.log(`Using Solana ${config.name} RPC:`, config.rpcUrl);
        return "https://eimile-xhu5ox-fast-devnet.helius-rpc.com";
    }, [config]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        []
    );

    return (
        <ConnectionProvider
            endpoint={endpoint}
            config={{
                commitment: 'confirmed',
                confirmTransactionInitialTimeout: 60000,
            }}
        >
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};


export function useAnchorProvider() {
    const { connection } = useConnection()
    const wallet = useWallet()

    return new AnchorProvider((connection as any), wallet as any, { commitment: 'confirmed' })
}