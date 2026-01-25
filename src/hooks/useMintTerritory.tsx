'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Keypair, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { useProgram } from './useProgram';
import { toast } from 'react-hot-toast';
import { useState, useRef } from 'react';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { getExplorerUrl } from '@/utils/beta';

const RATE_LIMIT_MS = 5000; // 5 seconds between transactions

export function useMintTerritory() {
    const { publicKey } = useWallet();
    const { program } = useProgram();
    const [isMinting, setIsMinting] = useState(false);
    const lastMintTime = useRef<number>(0);

    const mintTerritory = async (x: number, y: number, customImage?: string) => {
        if (!publicKey || !program) {
            toast.error('Please connect your wallet first');
            return null;
        }

        // Rate limiting check
        const now = Date.now();
        const timeSinceLastMint = now - lastMintTime.current;

        if (timeSinceLastMint < RATE_LIMIT_MS) {
            const waitTime = Math.ceil((RATE_LIMIT_MS - timeSinceLastMint) / 1000);
            toast.error(
                `⏱️ Please wait ${waitTime}s before minting again`,
                { duration: 3000 }
            );
            return null;
        }

        setIsMinting(true);
        const mintToast = toast.loading('Preparing transaction...');

        try {
            // 1. Generate new Mint Keypair
            const nftMint = Keypair.generate();

            // 2. Derive PDAs
            const [territoryPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("territory"), Buffer.from([x]), Buffer.from([y])],
                program.programId
            );

            const [gridStatePda] = PublicKey.findProgramAddressSync(
                [Buffer.from("grid_state")],
                program.programId
            );

            // 3. Get Associated Token Account
            const nftTokenAccount = await getAssociatedTokenAddress(
                nftMint.publicKey,
                publicKey
            );

            console.log('Minting territory at:', x, y);
            console.log('Mint Address:', nftMint.publicKey.toString());
            console.log('Territory PDA:', territoryPda.toString());

            // 4. Send Transaction
            // The argument 'blockType' is ignored by the contract logic (calculated on-chain),
            // but we must pass a valid enum variant to match IDL. Passing 'standard'.
            const tx = await program.methods
                .mintTerritory(x, y, { standard: {} })
                .accounts({
                    territory: territoryPda,
                    gridState: gridStatePda,
                    nftMint: nftMint.publicKey,
                    nftTokenAccount: nftTokenAccount,
                    buyer: publicKey,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                    rent: SYSVAR_RENT_PUBKEY,
                })
                .signers([nftMint]) // We only need to list the Mint Keypair; wallet is auto-signed by provider
                .rpc();

            console.log('Transaction signature:', tx);

            // Update last mint time
            lastMintTime.current = Date.now();

            const explorerUrl = getExplorerUrl(tx);
            toast.success(
                <span>
                Territory minted successfully! < br />
            <a href={ explorerUrl } target = "_blank" rel = "noopener noreferrer" className = "underline font-bold" >
            View Transaction
            </a>
            </span>, 
                { id: mintToast, duration: 8000 }
            );

            return tx;
        } catch (error: any) {
            console.error('Minting error:', error);

            // Extract meaningful error message if possible
            let errorMessage = 'Minting failed';
            if (error.message) {
                if (error.message.includes('User rejected')) {
                    errorMessage = 'Transaction rejected by user';
                } else if (error.message.includes('0x1')) { // Insufficient funds often
                    errorMessage = 'Insufficient funds or transaction failed';
                } else {
                    errorMessage = `Minting failed: ${error.message}`;
                }
            }

            toast.error(errorMessage, { id: mintToast });
            return null;
        } finally {
            setIsMinting(false);
        }
    };

    return { mintTerritory, isMinting };
}
