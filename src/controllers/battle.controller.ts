import { Request, Response } from 'express';
import { databaseService } from '../services/database.service';

export const battleController = {
    async getActiveBattles(req: Request, res: Response) {
        try {
            // Mock wallet for now, or extract from auth middleware
            const wallet = req.query.wallet as string;
            if (!wallet) return res.json([]);

            const battles = await databaseService.getActiveBattles(wallet);
            res.json(battles);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch active battles' });
        }
    },

    async getBattleHistory(req: Request, res: Response) {
        res.json([]);
    },

    async getBattle(req: Request, res: Response) {
        res.json({});
    }
};
