// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Cluster, PublicKey } from "@solana/web3.js";
import GameIDL from "../target/idl/empire_game.json";
import type { EmpireGame } from "../target/type/empire_game";

// Re-export the generated IDL and type
export { EmpireGame, GameIDL };

// The programId is imported from the program IDL.
export const GAME_PROGRAM_ID = new PublicKey(GameIDL.address);

// This is a helper function to get the Protocol Anchor program.
export function getGameProgram(
    provider: AnchorProvider,
    address?: PublicKey
): Program<EmpireGame> {
    return new Program(
        {
            ...GameIDL,
            address: address ? address.toBase58() : GameIDL.address,
        } as EmpireGame,
        provider
    );
}

// This is a helper function to get the program ID for the Protocol program depending on the cluster.
export function getGameProgramId(cluster: Cluster) {
    switch (cluster) {
        case "devnet":
        case "testnet":
            // This is the program ID for the Protocol program on devnet and testnet.
            return new PublicKey("2qhP9sL3Mk2kvnqVHzthEkZUrtAJyqzfE4vdcWgiaBxi");
        case "mainnet-beta":
        default:
            return GAME_PROGRAM_ID;
    }
}