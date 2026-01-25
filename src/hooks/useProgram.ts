import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';
// import idl from '@/idl/empire_blocks.json'; // We might need this, using any for now or need to find where IDL is

const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID || '11111111111111111111111111111111');

export const useProgram = () => {
    const { connection } = useConnection();
    const wallet = useAnchorWallet();

    const provider = useMemo(() => {
        if (!wallet) return null;
        return new AnchorProvider(connection, wallet, {
            preflightCommitment: 'confirmed',
        });
    }, [connection, wallet]);

    const program = useMemo(() => {
        if (!provider) return null;

        // Mock IDL if file not found, or user needs to provide it. 
        // For now using a minimal IDL or 'any' cast
        const idl: Idl = {
            version: "0.1.0",
            name: "empire_blocks",
            instructions: [
                {
                    "name": "mintTerritory",
                    "accounts": [
                        { "name": "territory", "isMut": true, "isSigner": false },
                        { "name": "gridState", "isMut": true, "isSigner": false },
                        { "name": "nftMint", "isMut": true, "isSigner": true },
                        { "name": "nftTokenAccount", "isMut": true, "isSigner": false },
                        { "name": "buyer", "isMut": true, "isSigner": true },
                        { "name": "tokenProgram", "isMut": false, "isSigner": false },
                        { "name": "associatedTokenProgram", "isMut": false, "isSigner": false },
                        { "name": "systemProgram", "isMut": false, "isSigner": false },
                        { "name": "rent", "isMut": false, "isSigner": false }
                    ],
                    "args": [
                        { "name": "x", "type": "u8" },
                        { "name": "y", "type": "u8" },
                        { "name": "blockType", "type": { "defined": "BlockType" } }
                    ]
                }
            ],
            types: [
                {
                    "name": "BlockType",
                    "type": {
                        "kind": "enum",
                        "variants": [
                            { "name": "Standard" },
                            { "name": "Capital" },
                            { "name": "Corner" },
                            { "name": "Border" }
                        ]
                    }
                }
            ],
            metadata: { address: PROGRAM_ID.toString() }
        };

        return new Program(idl, PROGRAM_ID, provider);
    }, [provider]);

    return { program };
};
