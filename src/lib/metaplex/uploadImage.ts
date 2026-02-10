import { Metaplex, bundlrStorage, walletAdapterIdentity } from '@metaplex-foundation/js';
import { Connection } from '@solana/web3.js';
/**
 * Image upload utilities for Arweave
 * This will work once 'arweave' package is installed
 */

/**
 * Upload image file to Arweave via Bundlr
 * @param file - Image file to upload
 * @param connection - Solana connection (for Bundlr payments)
 * @param wallet - Wallet for signing transactions
 * @returns Arweave URI of uploaded image
 */
export async function uploadImageToArweave(
    file: File,
    connection: Connection,
    wallet: any
): Promise<string> {
    try {
        // Determine bundlr address based on network
        const isMainnet = !connection.rpcEndpoint.includes('devnet');
        const bundlrAddress = isMainnet
            ? 'https://node1.bundlr.network'
            : 'https://devnet.bundlr.network';

        const metaplex = Metaplex.make(connection)
            .use(walletAdapterIdentity(wallet))
            .use(bundlrStorage({
                address: bundlrAddress,
                providerUrl: connection.rpcEndpoint,
                timeout: 60000,
            }));

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Arweave via Bundlr
        const uri = await metaplex.storage().upload({
            buffer,
            fileName: file.name,
            displayName: file.name,
            uniqueName: `territory-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            contentType: file.type,
            extension: file.name.split('.').pop() || 'png',
            tags: [{ name: 'Content-Type', value: file.type }],
        });

        console.log('Image uploaded to Arweave:', uri);
        return uri;
    } catch (error: any) {
        console.error('Arweave upload error:', error);
        throw new Error(`Failed to upload image to Arweave: ${error.message}`);
    }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'File size must be less than 5MB'
        };
    }

    // Check file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'File must be PNG, JPG, or GIF'
        };
    }

    return { valid: true };
}

/**
 * Create image preview URL
 */
export function createImagePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                resolve(e.target.result as string);
            } else {
                reject(new Error('Failed to read file'));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}
