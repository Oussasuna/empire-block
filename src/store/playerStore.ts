import { create } from 'zustand';
import { apiClient } from '@/api/client';

interface Player {
    wallet_address: string;
    total_blocks_owned: number;
    total_revenue_earned: number;
    battles_won: number;
    battles_lost: number;
}

interface PlayerState {
    player: Player | null;
    loading: boolean;
    loadPlayer: (walletAddress: string) => Promise<void>;
    updatePlayer: (updates: Partial<Player>) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
    player: null,
    loading: false,
    loadPlayer: async (walletAddress: string) => {
        set({ loading: true });
        try {
            const response = await apiClient.get<Player>(`/player/${walletAddress}`);
            set({ player: response.data, loading: false });
        } catch (error) {
            console.error("Failed to load player", error);
            // On error (e.g. 404 meaning new player), we could set a default empty state or null
            // For now, we'll assume null means "not found/not initialized"
            set({ player: null, loading: false });
        }
    },
    updatePlayer: (updates) =>
        set((state) => ({
            player: state.player ? { ...state.player, ...updates } : null,
        })),
}));
