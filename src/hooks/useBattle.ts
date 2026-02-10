import { useState, useCallback, useRef } from 'react';
import { apiClient } from '@/api/client';
import { toast } from 'react-hot-toast';
import { isBetaMode, getExplorerUrl } from '@/utils/beta';
import { trackBetaEvent } from '@/utils/analytics';
import {
    Army,
    Territory,
    predictBattleOutcome,
    createEmptyArmy,
    createTerritory
} from '@/lib/battle/BattleSystem';

const RATE_LIMIT_MS = 5000; // 5 seconds between battles

export interface Battle {
    battle_id: string;
    attacker_wallet: string;
    defender_wallet: string;
    territory_id: string;
    status: 'active' | 'completed' | 'pending';
    winner_wallet?: string;
    started_at: string;
    ended_at?: string;
    territory?: {
        x_coordinate: number;
        y_coordinate: number;
        block_type: string;
    };
}

export const useBattle = () => {
    const [activeBattles, setActiveBattles] = useState<Battle[]>([]);
    const [history, setHistory] = useState<Battle[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const lastBattleTime = useRef<number>(0);

    const fetchActiveBattles = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<Battle[]>('/battles/active');
            setActiveBattles(response.data);
        } catch (error) {
            console.error('Failed to fetch active battles:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<Battle[]>('/battles/history');
            setHistory(response.data);
        } catch (error) {
            console.error('Failed to fetch battle history:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const initiateBattle = async (x: number, y: number, army?: Army) => {
        // Rate limiting check
        const now = Date.now();
        const timeSinceLastBattle = now - lastBattleTime.current;

        if (timeSinceLastBattle < RATE_LIMIT_MS) {
            const waitTime = Math.ceil((RATE_LIMIT_MS - timeSinceLastBattle) / 1000);
            toast.error(
                `⏱️ Please wait ${waitTime}s before starting another battle`,
                { duration: 3000 }
            );
            return false;
        }

        setIsLoading(true);

        // Track beta event
        if (isBetaMode()) {
            trackBetaEvent('battle_initiate_attempted', { x, y });
        }

        try {
            // In a real scenario, this involves signing a transaction to stake tokens
            await apiClient.post(`/battles/initiate`, { x, y, army });

            lastBattleTime.current = Date.now();

            const successMessage = isBetaMode()
                ? '⚔️ Battle declared on DEVNET! (Test battle)'
                : '⚔️ Battle declared!';

            toast.success(successMessage);

            if (isBetaMode()) {
                trackBetaEvent('battle_initiate_success', { x, y });
            }

            await fetchActiveBattles();
            return true;
        } catch (error) {
            console.error('Failed to initiate battle:', error);
            toast.error('Failed to start battle');

            if (isBetaMode()) {
                trackBetaEvent('battle_initiate_failed', { x, y, error: String(error) });
            }

            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const predictOutcome = useCallback((attackerArmy: Army, defenderTerritory: Territory) => {
        return predictBattleOutcome(attackerArmy, defenderTerritory);
    }, []);

    return {
        activeBattles,
        history,
        isLoading,
        fetchActiveBattles,
        fetchHistory,
        initiateBattle,
        predictOutcome
    };
};
