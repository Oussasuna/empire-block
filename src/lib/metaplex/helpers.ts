import { Connection, PublicKey, Keypair } from '@solana/web3.js';

/**
 * Helper functions for Metaplex NFT minting
 * These will work once @metaplex-foundation/js is installed
 */

/**
 * Determine block type based on coordinates
 */
export function determineBlockType(x: number, y: number): string {
    // Corner blocks (4 total)
    if ((x === 0 && y === 0) || (x === 0 && y === 49) ||
        (x === 49 && y === 0) || (x === 49 && y === 49)) {
        return 'corner';
    }

    // Border blocks
    if (x === 0 || x === 49 || y === 0 || y === 49) {
        return 'border';
    }

    // Capital blocks (every 10x10)
    if (x % 10 === 0 && y % 10 === 0) {
        return 'capital';
    }

    // Standard blocks
    return 'standard';
}

/**
 * Get revenue multiplier based on block type
 */
export function getMultiplier(blockType: string): string {
    const multipliers: Record<string, string> = {
        'standard': '1.0x',
        'border': '1.0x',
        'capital': '2.0x',
        'corner': '3.0x',
    };
    return multipliers[blockType] || '1.0x';
}

/**
 * Get default image URL based on block type
 * TODO: Replace with actual Arweave URLs after uploading default images
 */
export function getDefaultImage(blockType: string): string {
    const defaults: Record<string, string> = {
        'standard': 'https://arweave.net/default-standard-territory.png',
        'border': 'https://arweave.net/default-border-territory.png',
        'capital': 'https://arweave.net/default-capital-territory.png',
        'corner': 'https://arweave.net/default-corner-territory.png',
    };
    return defaults[blockType] || defaults['standard'];
}

/**
 * Generate NFT metadata object
 */
export function generateMetadata(
    x: number,
    y: number,
    blockType: string,
    customImage?: string,
    creatorAddress?: string
) {
    const image = customImage || getDefaultImage(blockType);
    const multiplier = getMultiplier(blockType);

    return {
        name: `Empire Blocks Territory #${x}_${y}`,
        symbol: 'EMPIRE',
        description: `Territory at position (${x}, ${y}) on the Empire Blocks grid. Type: ${blockType}. Revenue Multiplier: ${multiplier}`,
        image: image,
        attributes: [
            { trait_type: 'X Coordinate', value: x },
            { trait_type: 'Y Coordinate', value: y },
            { trait_type: 'Block Type', value: blockType },
            { trait_type: 'Revenue Multiplier', value: multiplier },
            { trait_type: 'Mint Timestamp', value: Date.now() },
            { trait_type: 'Grid Position', value: `(${x}, ${y})` }
        ],
        properties: {
            files: [
                {
                    uri: image,
                    type: 'image/png'
                }
            ],
            category: 'image',
            creators: creatorAddress ? [
                {
                    address: creatorAddress,
                    share: 100
                }
            ] : []
        }
    };
}

/**
 * Get color for block type (for grid display)
 */
export function getColorByType(blockType: string): string {
    const colors: Record<string, string> = {
        'standard': '#8b5cf6', // purple-500
        'border': '#3b82f6',   // blue-500
        'capital': '#f59e0b',  // amber-500
        'corner': '#ef4444',   // red-500
    };
    return colors[blockType] || colors['standard'];
}

/**
 * Calculate mint price based on block type
 */
export function getMintPrice(blockType: string): number {
    // All blocks cost 0.1 SOL for now
    // Can be adjusted later for premium blocks
    return 0.1;
}

/**
 * Validate coordinates
 */
export function isValidCoordinate(x: number, y: number): boolean {
    return x >= 0 && x < 50 && y >= 0 && y < 50;
}
