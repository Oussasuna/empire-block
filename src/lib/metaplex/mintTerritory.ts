import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Metaplex, walletAdapterIdentity, bundlrStorage } from '@metaplex-foundation/js';
import { getNetworkConfig, isMainnet, getExplorerUrl } from '../solana/config';
import { withRetry } from '../solana/rpcHelpers';
import { uploadImageToArweave } from './uploadImage';

interface MintTerritoryParams {
    connection: Connection;
    wallet: any;
    coordinates: { x: number; y: number };
    name: string;
    imageFile?: File;
    imageUri?: string;
}

export async function mintTerritory({
    connection,
    wallet,
    coordinates,
    name,
    imageFile,
    imageUri,
}: MintTerritoryParams): Promise<{ signature: string; mintAddress: string }> {
    try {
        if (!wallet.publicKey) {
            throw new Error('Wallet not connected');
        }

        const config = getNetworkConfig();
        console.log(`Minting on ${config.name}...`);

        // Setup Metaplex
        const metaplex = Metaplex.make(connection)
            .use(walletAdapterIdentity(wallet))
            .use(bundlrStorage({
                address: config.bundlrAddress,
                providerUrl: config.rpcUrl,
                timeout: 60000,
            }));

        // Upload image if provided
        let finalImageUri = imageUri || '';
        if (imageFile && !imageUri) {
            console.log('Uploading territory image...');
            finalImageUri = await uploadImageToArweave(imageFile, connection, wallet);
        }

        // If no image, use a default placeholder
        if (!finalImageUri) {
            finalImageUri = 'https://arweave.net/placeholder-territory-image';
        }

        // Create NFT metadata
        const metadata = {
            name: name || `Territory (${coordinates.x}, ${coordinates.y})`,
            symbol: 'EMPIRE',
            description: `Empire Blocks Territory at coordinates (${coordinates.x}, ${coordinates.y})`,
            image: finalImageUri,
            attributes: [
                { trait_type: 'X Coordinate', value: coordinates.x.toString() },
                { trait_type: 'Y Coordinate', value: coordinates.y.toString() },
                { trait_type: 'Rarity', value: 'Standard' },
                { trait_type: 'Network', value: isMainnet() ? 'Mainnet' : 'Devnet' },
            ],
            properties: {
                files: [{ uri: finalImageUri, type: 'image/png' }],
                category: 'image',
            },
        };

        console.log('Creating NFT with metadata:', metadata);

        // Upload metadata to Arweave first
        const { uri: metadataUri } = await withRetry(async () => {
            return metaplex.nfts().uploadMetadata(metadata);
        });

        console.log('Metadata uploaded:', metadataUri);

        // Mint NFT with retry
        const { nft, response } = await withRetry(async () => {
            return metaplex.nfts().create({
                uri: metadataUri,
                name: metadata.name,
                symbol: metadata.symbol,
                sellerFeeBasisPoints: 500, // 5% royalty
                creators: [{ address: wallet.publicKey, share: 100 }],
            });
        });

        const signature = response.signature;
        const mintAddress = nft.address.toBase58();

        console.log('Territory minted successfully!');
        console.log('Signature:', signature);
        console.log('Mint Address:', mintAddress);
        console.log('Explorer:', getExplorerUrl(signature));

        return { signature, mintAddress };
    } catch (error: any) {
        console.error('Minting failed:', error);
        throw new Error(`Failed to mint territory: ${error.message}`);
    }
}
