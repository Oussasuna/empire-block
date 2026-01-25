import { Request, Response } from 'express';
import { databaseService } from '../services/database.service';

export const playerController = {
    async getProfile(req: Request, res: Response) {
        try {
            const { wallet } = req.params;
            const { data: profile, error } = await databaseService.getPlayer(wallet);
            if (error || !profile) {
                return res.status(404).json({ error: 'Player not found' });
            }
            res.json(profile);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch player profile' });
        }
    },

    async getTerritories(req: Request, res: Response) {
        try {
            const { wallet } = req.params;
            const { data: territories, error } = await databaseService.getPlayerTerritories(wallet);
            if (error) {
                return res.status(500).json({ error: 'Failed to fetch player territories' });
            }
            res.json(territories || []);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch player territories' });
        }
    },

    async getRevenue(req: Request, res: Response) {
        // Placeholder
        res.json({ total: 0, unclaimed: 0, history: [] });
    },

    async getBattles(req: Request, res: Response) {
        // Placeholder
        res.json([]);
    },

    async updateProfile(req: Request, res: Response) {
        try {
            const { wallet } = req.params;
            const data = req.body;
            const { data: updated, error } = await databaseService.upsertPlayer(wallet, data);
            if (error) {
                return res.status(500).json({ error: 'Failed to update profile' });
            }
            res.json(updated);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update profile' });
        }
    },

    async getLeaderboard(req: Request, res: Response) {
        // Placeholder
        res.json([]);
    }
};

