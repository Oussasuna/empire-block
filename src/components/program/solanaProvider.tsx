'use client'

import dynamic from 'next/dynamic'
import { AnchorProvider } from '@coral-xyz/anchor'
import { WalletError } from '@solana/wallet-adapter-base'
import {
    useConnection,
    useWallet,
    ConnectionProvider,
    WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { ReactNode, useCallback } from 'react'
import { useCluster } from './cluster'

require('@solana/wallet-adapter-react-ui/styles.css')

export const WalletButton = dynamic(async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton, {
    ssr: false,
});

export function SolanaProvider({ children }: { children: ReactNode }) {
    const { cluster } = useCluster()
    // const endpoint = useMemo(() => cluster.endpoint, [cluster]) // DEVENT
    // const endpoint = "https://jinny-vsmbdp-fast-mainnet.helius-rpc.com" // MAINNET
    const endpoint = "https://eimile-xhu5ox-fast-devnet.helius-rpc.com" // DEVENET
    const onError = useCallback((error: WalletError) => {
        console.error(error)
    }, [])

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[]} onError={onError} autoConnect={true}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

