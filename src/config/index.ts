import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3001,

    solana: {
        rpcUrl: process.env.SOLANA_RPC_URL || `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY || ''}`,
        programId: process.env.PROGRAM_ID || '',
        commitment: 'confirmed' as const,
    },

    supabase: {
        url: process.env.SUPABASE_URL || '',
        anonKey: process.env.SUPABASE_ANON_KEY || '',
        serviceKey: process.env.SUPABASE_SERVICE_KEY || '',
    },

    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    },

    helius: {
        apiKey: process.env.HELIUS_API_KEY || '',
        webhookUrl: process.env.HELIUS_WEBHOOK_URL || '',
    },
};
