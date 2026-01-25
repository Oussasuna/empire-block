import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Territory {
    x_coordinate: number;
    y_coordinate: number;
    owner_wallet: string | null;
    block_type: 'standard' | 'capital' | 'corner' | 'border';
    visual_config: {
        color_r: number;
        color_g: number;
        color_b: number;
        pattern: number;
        logo_index: number;
    };
    revenue_multiplier: number;
}

export const useGrid = () => {
    const [territories, setTerritories] = useState<Territory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGrid = async () => {
            try {
                // In a real scenario, this would fetch from the backend API
                // const response = await axios.get('http://localhost:3001/api/grid/territories');
                // setTerritories(response.data);

                // Mock data for initial visualization
                const mockTerritories: Territory[] = [];
                for (let x = 0; x < 50; x++) {
                    for (let y = 0; y < 50; y++) {
                        let type: Territory['block_type'] = 'standard';
                        if ((x === 0 && y === 0) || (x === 49 && y === 0) || (x === 0 && y === 49) || (x === 49 && y === 49)) type = 'corner';
                        else if (x === 0 || y === 0 || x === 49 || y === 49) type = 'border';
                        else if (Math.abs(x - 25) <= 2 && Math.abs(y - 25) <= 2) type = 'capital';

                        mockTerritories.push({
                            x_coordinate: x,
                            y_coordinate: y,
                            owner_wallet: null,
                            block_type: type,
                            visual_config: {
                                color_r: 100,
                                color_g: 100,
                                color_b: 100,
                                pattern: 0,
                                logo_index: 0
                            },
                            revenue_multiplier: 1.0
                        });
                    }
                }
                setTerritories(mockTerritories);
            } catch (err) {
                setError('Failed to fetch grid data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchGrid();
    }, []);

    return { territories, isLoading, error };
};
