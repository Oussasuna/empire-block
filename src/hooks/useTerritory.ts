import { useState, useEffect } from 'react';
import { apiClient } from '@/api/client';

interface Territory {
    territory_id: string;
    x_coordinate: number;
    y_coordinate: number;
    owner_wallet: string;
    block_type: 'standard' | 'capital' | 'corner' | 'border';
    revenue_multiplier: number;
    last_sale_price?: number;
    total_revenue_earned?: number;
}

export const useTerritory = (x: number, y: number) => {
    const [territory, setTerritory] = useState<Territory | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTerritory = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get<Territory>(`/grid/territory/${x}/${y}`);
                setTerritory(response.data);
            } catch (error) {
                // If 404, it means territory is valid but unclaimed/not in DB yet
                // But for now, let's assume if it errors, it's null (unclaimed)
                // console.error("Error fetching territory:", error);
                setTerritory(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTerritory();
    }, [x, y]);

    return { territory, isLoading };
};
