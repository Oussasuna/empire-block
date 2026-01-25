import { Request, Response } from 'express';
import { solanaService } from '../services/solana.service';
import { databaseService } from '../services/database.service';

export const gridController = {
    async getState(req: Request, res: Response) {
        try {
            const state = await solanaService.getGridState();
            res.json(state);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch grid state' });
        }
    },

    async getAllTerritories(req: Request, res: Response) {
        try {
            const { data: territories, error } = await databaseService.getAllTerritories();
            if (error) {
                return res.status(500).json({ error: 'Failed to fetch territories' });
            }
            res.json(territories || []);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch territories' });
        }
    },

    async getTerritory(req: Request, res: Response) {
        try {
            const { x, y } = req.params;
            const { data: territory, error } = await databaseService.getTerritory(Number(x), Number(y));
            if (error || !territory) {
                return res.status(404).json({ error: 'Territory not found' });
            }
            res.json(territory);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch territory' });
        }
    },

    async getGlobalStats(req: Request, res: Response) {
        // Placeholder for global stats logic
        res.json({
            totalVolume: 0,
            activePlayers: 0,
            battlesResolved: 0
        });
    }
};

