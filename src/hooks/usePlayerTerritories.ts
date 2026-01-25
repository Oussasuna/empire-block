import { useState, useEffect } from 'react';
import { apiClient } from '@/api/client';

interface Territory {
    territory_id: string;
    x_coordinate: number;
    y_coordinate: number;
    block_type: string;
    revenue_multiplier: number;
    total_revenue_earned?: number;
}

interface Empire {
    id: string;
    name: string;
    territory_count: number;
}

export const usePlayerTerritories = (walletAddress?: string) => {
    const [territories, setTerritories] = useState<Territory[]>([]);
    const [empires, setEmpires] = useState<Empire[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!walletAddress) {
            setTerritories([]);
            setEmpires([]);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get<Territory[]>(`/player/${walletAddress}/territories`);
                setTerritories(response.data);
                // Empires logic can be added later or fetched from another endpoint
                setEmpires([]);
            } catch (error) {
                console.error("Error fetching player territories:", error);
                setTerritories([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [walletAddress]);

    return { territories, empires, isLoading };
};
