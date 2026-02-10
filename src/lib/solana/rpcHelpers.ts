import { Connection } from '@solana/web3.js';

export async function withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;
            const errorMessage = error.message || '';

            // Retry on rate limit or temporary errors
            if (
                errorMessage.includes('403') ||
                errorMessage.includes('429') ||
                errorMessage.includes('Too many requests') ||
                errorMessage.includes('timeout')
            ) {
                const delay = baseDelay * Math.pow(2, attempt);
                console.log(`RPC error, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            // Don't retry on other errors
            throw error;
        }
    }

    throw lastError || new Error('Max retries exceeded');
}

export async function getRecentBlockhash(connection: Connection) {
    return withRetry(() => connection.getLatestBlockhash('confirmed'));
}

export async function sendAndConfirmWithRetry(
    connection: Connection,
    transaction: any,
    signers: any[]
) {
    return withRetry(async () => {
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
        transaction.recentBlockhash = blockhash;
        transaction.lastValidBlockHeight = lastValidBlockHeight;

        const signature = await connection.sendTransaction(transaction, signers);
        await connection.confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight,
        });

        return signature;
    });
}
