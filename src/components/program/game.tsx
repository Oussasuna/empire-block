'use client'

import { getGameProgram, getGameProgramId } from '../../anchor/src/index'
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { GetProgramAccountsFilter, LAMPORTS_PER_SOL, PublicKey, SystemProgram } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'react-toastify'
import { useCluster } from './cluster'
import { useAnchorProvider } from '../../lib/solana/wallet'
import { web3, BN } from '@coral-xyz/anchor'
import { ToastStats } from './constants'

// ── PDA Seed constants (must match the Anchor program exactly) ─────────────────
const SEED_GAME = Buffer.from('game')
const SEED_LAND = Buffer.from('land')
const SEED_USER = Buffer.from('user')
const SEED_LISTING = Buffer.from('listing')
const SEED_BATTLE_CHALLENGE = Buffer.from('battle_challenge')

// ── Treasury wallet (set to the programme authority / your admin wallet) ──────
// Replace this with the actual treasury public key for your deployment.
export const TREASURY = new PublicKey('BTLgpLd3USLS2GPR2r3quQZNBDoXJTEuduCjRAQcbnZ6')

// ─────────────────────────────────────────────────────────────────────────────

export function useGameProgram() {
    const { connection } = useConnection()
    const anchorWallet = useAnchorWallet()
    const { cluster } = useCluster()
    const provider = useAnchorProvider()
    const programId = useMemo(() => getGameProgramId('devnet'), ['devnet'])
    const program = useMemo(() => getGameProgram(provider, programId), [provider, programId])

    // ── PDA helpers ────────────────────────────────────────────────────────────

    /** seeds: ["game"] */
    const deriveGamePda = () =>
        PublicKey.findProgramAddressSync([SEED_GAME], programId)

    /** seeds: ["user", walletPubkey] */
    const deriveUserProfilePda = (wallet: PublicKey) =>
        PublicKey.findProgramAddressSync([SEED_USER, wallet.toBuffer()], programId)

    /** seeds: ["land", totalLands as u64 LE] — pass the current total_lands counter */
    const deriveLandPda = (totalLands: BN) => {
        const buf = Buffer.alloc(8)
        buf.writeBigUInt64LE(BigInt(totalLands.toString()))
        return PublicKey.findProgramAddressSync([SEED_LAND, buf], programId)
    }

    /** seeds: ["listing", date, landPubkey] */
    const deriveListingPda = (land: PublicKey, date: BN) => {
        const buf = Buffer.alloc(8)
        buf.writeBigInt64LE(BigInt(date.toString()))
        return PublicKey.findProgramAddressSync([SEED_LISTING, buf, land.toBuffer()], programId)
    }

    /** seeds: ["battle_challenge", date, attackerPubkey, defenderLandId as u64 LE] */
    const deriveBattleChallengePda = (attacker: PublicKey, defenderLandId: BN, date: BN) => {
        const dateBuf = Buffer.alloc(8)
        dateBuf.writeBigInt64LE(BigInt(date.toString()))
        const idBuf = Buffer.alloc(8)
        idBuf.writeBigUInt64LE(BigInt(defenderLandId.toString()))
        return PublicKey.findProgramAddressSync(
            [SEED_BATTLE_CHALLENGE, dateBuf, attacker.toBuffer(), idBuf],
            programId
        )
    }

    // ── Lazy user-profile initializer ──────────────────────────────────────────

    /**
     * Returns a single `initializeUser` TransactionInstruction if the caller's
     * user profile PDA does not exist yet, otherwise returns an empty array.
     * Pass the result directly to `.preInstructions(preIxs)` on any Anchor call.
     */
    const ensureUserProfileIx = async (imageUrl = '') => {
        const [pda] = deriveUserProfilePda(anchorWallet!.publicKey)
        const info = await connection.getAccountInfo(pda)
        if (info !== null) return []  // already initialised → no-op

        // Build the ix without broadcasting it
        const ix = await program.methods
            .initializeUser(imageUrl)
            .accountsStrict({
                user: anchorWallet!.publicKey,
                userProfile: pda,
                systemProgram: SystemProgram.programId,
            })
            .instruction()

        console.log('[ensureUserProfileIx] user profile not found — prepending initializeUser')
        return [ix]
    }

    // ── Queries ────────────────────────────────────────────────────────────────

    /** Fetch the single global game state account */
    const gameAccount = useQuery({
        queryKey: ['game', 'state', { cluster }],
        queryFn: () => program.account.game.all(),
    })

    /** Fetch all Land accounts */
    const allLands = useQuery({
        queryKey: ['game', 'lands', { cluster }],
        queryFn: () => program.account.land.all(),
    })

    /** Fetch all user Land accounts */
    const allUserLands = useQuery({
        queryKey: ['game', 'User lands', { cluster, wallet: anchorWallet?.publicKey?.toBase58() }],
        enabled: !!anchorWallet,
        queryFn: () => {
            if (!anchorWallet) return [];
            const userFilter: GetProgramAccountsFilter = {
                memcmp: {
                    offset: 8,
                    bytes: anchorWallet.publicKey.toBase58(),
                },
            };
            return program.account.land.all([userFilter]);
        },
    })

    /** Fetch all Listing accounts (active only, for marketplace) */
    const allListings = useQuery({
        queryKey: ['game', 'listings', { cluster }],
        queryFn: () => {
            const userFilter: GetProgramAccountsFilter = {
                dataSize: 100 - 1,
            };
            return program.account.listing.all([userFilter])
        },
    })

    /** Fetch ALL Listing accounts including inactive (for activity feed) */
    const allActivity = useQuery({
        queryKey: ['game', 'activity', { cluster }],
        queryFn: () => program.account.listing.all(),
    })

    /** Fetch all BattleChallenge accounts */
    const allBattles = useQuery({
        queryKey: ['game', 'battles', { cluster }],
        queryFn: () => program.account.battleChallenge.all(),
    })

    /** Fetch the connected wallet's User profile */
    const myProfile = useQuery({
        queryKey: ['game', 'my-profile', { cluster, wallet: anchorWallet?.publicKey?.toBase58() }],
        enabled: !!anchorWallet,
        queryFn: async () => {
            if (!anchorWallet) return null
            const [pda] = deriveUserProfilePda(anchorWallet.publicKey)
            return program.account.user.fetchNullable(pda)
        },
    })

    // ── Mutations ──────────────────────────────────────────────────────────────

    /**
     * initialize — admin-only, called once to bootstrap the global game state.
     * @param pricePerLand  price to mint a land tile (lamports)
     * @param battleFee     fee paid by the attacker per battle (lamports)
     */
    const initialize = useMutation({
        mutationKey: ['game', 'initialize', { cluster }],
        mutationFn: async ({
            pricePerLand,
            battleFee,
        }: { pricePerLand: BN; battleFee: BN }) => {
            const [game] = deriveGamePda()
            transactionToast(ToastStats.Loading)
            console.log('initializing game', pricePerLand, battleFee)
            return program.methods
                .initialize(new BN(pricePerLand), new BN(battleFee))
                .accountsStrict({
                    game,
                    signer: anchorWallet!.publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc()
        },
        onSuccess: (tx) => {
            console.log('initialize', tx)
            transactionToast(ToastStats.Delete)
            transactionToast(ToastStats.Success)
            gameAccount.refetch()
        },
        onError: () => {
            transactionToast(ToastStats.Delete)
            transactionToast(ToastStats.Error)
        },
    })





    /**
     * initializeUser — creates a user profile PDA for the connected wallet.
     * Must be called before minting or battling.
     * @param imageUrl  avatar URL (≤ 200 chars)
     */
    const initializeUser = useMutation({
        mutationKey: ['game', 'initializeUser', { cluster }],
        mutationFn: async ({ imageUrl }: { imageUrl: string }) => {
            const [userProfile] = deriveUserProfilePda(anchorWallet!.publicKey)
            transactionToast(ToastStats.Loading)
            return program.methods
                .initializeUser(imageUrl)
                .accountsStrict({
                    user: anchorWallet!.publicKey,
                    userProfile,
                    systemProgram: SystemProgram.programId,
                })
                .rpc()
        },
        onSuccess: (tx) => {
            console.log('initializeUser', tx)
            transactionToast(ToastStats.Delete)
            transactionToast(ToastStats.Success)
            myProfile.refetch()
        },
        onError: () => {
            transactionToast(ToastStats.Delete)
            transactionToast(ToastStats.Error)
        },
    })




    /**
     * mintLand — mint a new Land tile for the connected wallet.
     * The land PDA is seeded with the current `game.total_lands` counter,
     * so we first fetch the game state to get the correct index.
     * @param treasury  the treasury PublicKey that receives the mint fee
     */
    const mintLand = useMutation({
        mutationKey: ['game', 'mintLand', { cluster }],
        mutationFn: async ({ treasury = TREASURY, imageUrl = '' }: { treasury?: PublicKey, imageUrl?: string } = {}) => {
            // Check & auto-init user profile if needed
            // await initialize.mutateAsync({ pricePerLand: 0.01 * LAMPORTS_PER_SOL, battleFee: 0.001 * LAMPORTS_PER_SOL })
            const preIxs = await ensureUserProfileIx(imageUrl)
            // Fetch game state to get next land index
            const [gamePda] = deriveGamePda()
            const gameState = await program.account.game.fetch(gamePda)
            const [land] = deriveLandPda(gameState.totalLands)
            const [userProfile] = deriveUserProfilePda(anchorWallet!.publicKey)
            console.log('Minting land...');
            console.log(userProfile)

            transactionToast(ToastStats.Loading)
            return program.methods
                .mintLand()
                .accountsStrict({
                    user: anchorWallet!.publicKey,
                    game: gamePda,
                    treasury,
                    land,
                    userProfile,
                    systemProgram: SystemProgram.programId,
                })
                .preInstructions(preIxs)
                .rpc()
        },
        onSuccess: (tx) => {
            console.log('mintLand', tx)
            transactionToast(ToastStats.Delete)
            transactionToast(ToastStats.Success)
            allUserLands.refetch()
            allLands.refetch()
            myProfile.refetch()
            gameAccount.refetch()
        },
        onError: () => {
            transactionToast(ToastStats.Delete)
            transactionToast(ToastStats.Error)
        },
    })

    /**
     * listLand — list an owned land tile for sale.
     * @param land   PublicKey of the Land account to list
     * @param price  asking price in lamports
     */
    const listLand = useMutation({
        mutationKey: ['game', 'listLand', { cluster }],
        mutationFn: async ({ land, price }: { land: PublicKey; price: BN }) => {
            const preIxs = await ensureUserProfileIx()
            const date = new BN(Date.now())
            const [listing] = deriveListingPda(land, date)
            transactionToast(ToastStats.Loading)
            return program.methods
                .listLand(date, price)
                .accountsStrict({
                    user: anchorWallet!.publicKey,
                    land,
                    listing,
                    systemProgram: SystemProgram.programId,
                })
                .preInstructions(preIxs)
                .rpc()
        },
        onSuccess: (tx) => {
            console.log('listLand', tx)
            transactionToast(ToastStats.Delete)
            transactionToast(ToastStats.Success)
            allLands.refetch()
            allListings.refetch()
            allUserLands.refetch()
        },
        onError: () => {
            transactionToast(ToastStats.Delete)
            transactionToast(ToastStats.Error)
        },
    })

    /**
     * cancelList — remove an active listing.
     * @param land  PublicKey of the Land account whose listing to cancel
     */

    const cancelList = useMutation({
        mutationKey: ['game', 'cancelList', { cluster }],
        mutationFn: async ({ land, listing }: { land: PublicKey; listing: PublicKey }) => {
            const preIxs = await ensureUserProfileIx()
            transactionToast(ToastStats.Loading)
            return program.methods
                .cancelList()
                .accountsStrict({
                    user: anchorWallet!.publicKey,
                    land,
                    listing,
                    systemProgram: SystemProgram.programId,
                })
                .preInstructions(preIxs)
                .rpc()
        },
        onSuccess: (tx) => {
            console.log('cancelList', tx)
            transactionToast(ToastStats.Delete)
            transactionToast(ToastStats.Success)
            allLands.refetch()
            allListings.refetch()
            allUserLands.refetch()
        },
        onError: () => {
            transactionToast(ToastStats.Delete)
            transactionToast(ToastStats.Error)
        },
    })

    /**
     * editList — update the asking price of an existing listing.
     * @param land      PublicKey of the Land account
     * @param newPrice  new asking price in lamports
     */
    const editList = useMutation({
        mutationKey: ['game', 'editList', { cluster }],
        mutationFn: async ({ land, newPrice, listing }: { land: PublicKey; newPrice: BN; listing: PublicKey }) => {
            const preIxs = await ensureUserProfileIx()
            transactionToast(ToastStats.Loading)
            return program.methods
                .editList(newPrice)
                .accountsStrict({
                    user: anchorWallet!.publicKey,
                    land,
                    listing,
                })
                .preInstructions(preIxs)
                .rpc()
        },
        onSuccess: (tx) => {
            console.log('editList', tx)
            transactionToast(ToastStats.Delete)
            transactionToast(ToastStats.Success)
            allListings.refetch()
            allUserLands.refetch()
        },
        onError: () => {
            transactionToast(ToastStats.Delete)
            transactionToast(ToastStats.Error)
        },
    })

    /**
     * buyLand — purchase a listed land tile.
     * @param land    PublicKey of the Land account being bought
     * @param seller  PublicKey of the current owner (receives SOL)
     */
    const buyLand = useMutation({
        mutationKey: ['game', 'buyLand', { cluster }],
        mutationFn: async ({ land, seller, listing }: { land: PublicKey; seller: PublicKey; listing: PublicKey }) => {
            const preIxs = await ensureUserProfileIx()
            transactionToast(ToastStats.Loading)
            return program.methods
                .buyLand()
                .accountsStrict({
                    buyer: anchorWallet!.publicKey,
                    seller,
                    land,
                    listing,
                    systemProgram: SystemProgram.programId,
                })
                .preInstructions(preIxs)
                .rpc()
        },
        onSuccess: (tx) => {
            console.log('buyLand', tx)
            transactionToast(ToastStats.Delete)
            transactionToast(ToastStats.Success)
            allLands.refetch()
            allListings.refetch()
            myProfile.refetch()
        },
        onError: () => {
            transactionToast(ToastStats.Delete)
            transactionToast(ToastStats.Error)
        },
    })

    /**
     * initiateBattle — open a battle challenge against a target land.
     * The attacker pays the battle fee upfront; the challenge is open for 24 h.
     * @param attackerLand    PublicKey of the attacker's own land
     * @param defenderLand    PublicKey of the land being challenged
     * @param defenderLandId  numeric land ID of the defender's land (u64)
     * @param treasury        treasury wallet that receives the battle fee
     */
    const initiateBattle = useMutation({
        mutationKey: ['game', 'initiateBattle', { cluster }],
        mutationFn: async ({
            attackerLand,
            defenderLand,
            defenderLandId,
            treasury = TREASURY,
        }: {
            attackerLand: PublicKey
            defenderLand: PublicKey
            defenderLandId: BN
            treasury?: PublicKey
        }) => {
            const [gamePda] = deriveGamePda()
            const [attackerProfile] = deriveUserProfilePda(anchorWallet!.publicKey)
            const date = new BN(Date.now())
            const [battleChallenge] = deriveBattleChallengePda(anchorWallet!.publicKey, defenderLandId, date)

            const preIxs = await ensureUserProfileIx()
            transactionToast(ToastStats.Loading)
            return program.methods
                .initiateBattle(date, defenderLandId)
                .accountsStrict({
                    attacker: anchorWallet!.publicKey,
                    attackerProfile,
                    attackerLand,
                    defenderLand,
                    game: gamePda,
                    treasury,
                    battleChallenge,
                    systemProgram: SystemProgram.programId,
                })
                .preInstructions(preIxs)
                .rpc()
        },
        onSuccess: (tx) => {
            console.log('initiateBattle', tx)
            transactionToast(ToastStats.Delete)
            transactionToast(ToastStats.Success)
            allBattles.refetch()
            myProfile.refetch()
        },
        onError: () => {
            transactionToast(ToastStats.Delete)
            transactionToast(ToastStats.Error)
        },
    })

    /**
     * acceptBattle — defender accepts an open challenge.
     * Power is calculated on-chain and the winner is decided immediately.
     * @param attackerPubkey   wallet address of the original attacker
     * @param attackerLand     PublicKey of the attacker's land
     * @param defenderLand     PublicKey of the defender's land (the challenged tile)
     * @param defenderLandId   numeric land ID used to re-derive the challenge PDA
     */
    const acceptBattle = useMutation({
        mutationKey: ['game', 'acceptBattle', { cluster }],
        mutationFn: async ({
            attackerPubkey,
            attackerLand,
            defenderLand,
            defenderLandId,
            date,
        }: {
            attackerPubkey: PublicKey
            attackerLand: PublicKey
            defenderLand: PublicKey
            defenderLandId: BN
            date: BN
        }) => {
            const [gamePda] = deriveGamePda()
            const [defenderProfile] = deriveUserProfilePda(anchorWallet!.publicKey)
            const [attackerProfile] = deriveUserProfilePda(attackerPubkey)
            const [battleChallenge] = deriveBattleChallengePda(attackerPubkey, defenderLandId, date)

            const preIxs = await ensureUserProfileIx()
            transactionToast(ToastStats.Loading)
            return program.methods
                .acceptBattle()
                .accountsStrict({
                    defender: anchorWallet!.publicKey,
                    defenderProfile,
                    attackerProfile,
                    attackerLand,
                    defenderLand,
                    game: gamePda,
                    battleChallenge,
                    systemProgram: SystemProgram.programId,
                })
                .preInstructions(preIxs)
                .rpc()
        },
        onSuccess: (tx) => {
            console.log('acceptBattle', tx)
            transactionToast(ToastStats.Delete)
            transactionToast(ToastStats.Success)
            allBattles.refetch()
            allLands.refetch()
            myProfile.refetch()
        },
        onError: () => {
            transactionToast(ToastStats.Delete)
            transactionToast(ToastStats.Error)
        },
    })

    /**
     * cancelBattle — attacker cancels an open (pending) challenge.
     * The battle fee is non-refundable; the PDA stays on-chain as history.
     * @param defenderLandId  numeric land ID used to re-derive the challenge PDA
     */
    const cancelBattle = useMutation({
        mutationKey: ['game', 'cancelBattle', { cluster }],
        mutationFn: async ({ defenderLandId, date }: { defenderLandId: BN; date: BN }) => {
            const [battleChallenge] = deriveBattleChallengePda(anchorWallet!.publicKey, defenderLandId, date)

            const preIxs = await ensureUserProfileIx()
            transactionToast(ToastStats.Loading)
            return program.methods
                .cancelBattle()
                .accountsStrict({
                    attacker: anchorWallet!.publicKey,
                    battleChallenge,
                    systemProgram: SystemProgram.programId,
                })
                .preInstructions(preIxs)
                .rpc()
        },
        onSuccess: (tx) => {
            console.log('cancelBattle', tx)
            transactionToast(ToastStats.Delete)
            transactionToast(ToastStats.Success)
            allBattles.refetch()
        },
        onError: () => {
            transactionToast(ToastStats.Delete)
            transactionToast(ToastStats.Error)
        },
    })

    // ── Return ─────────────────────────────────────────────────────────────────

    return {
        program,
        programId,
        // queries
        gameAccount,
        allLands,
        allListings,
        allActivity,
        allBattles,
        myProfile,
        allUserLands,
        // PDA helpers (in case consumers need them)
        deriveGamePda,
        deriveUserProfilePda,
        deriveLandPda,
        deriveListingPda,
        deriveBattleChallengePda,
        // mutations
        initialize,
        initializeUser,
        mintLand,
        listLand,
        cancelList,
        editList,
        buyLand,
        initiateBattle,
        acceptBattle,
        cancelBattle,
    }
}

// ── Toast helper ───────────────────────────────────────────────────────────────

export function transactionToast(stats: ToastStats, message?: string, id?: number) {
    switch (stats) {
        case ToastStats.Delete: return toast.dismiss(id)
        case ToastStats.Success: return toast.success('Transaction Success!')
        case ToastStats.Error: return toast.error('Transaction Failed!')
        case ToastStats.Loading: return toast.loading('Transaction Pending!')
        case ToastStats.Info: return toast.info(message)
        case ToastStats.Warning: return toast.warning(message)
        default: return null
    }
}