import { Request, Response } from 'express';
import { databaseService } from '../services/database.service';

export const marketplaceController = {
    async getListings(req: Request, res: Response) {
        try {
            const { data: listings, error } = await databaseService.getActiveListings();
            if (error) {
                return res.status(500).json({ error: 'Failed to fetch listings' });
            }
            res.json(listings || []);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch listings' });
        }
    },

    async createListing(req: Request, res: Response) {
        try {
            const { data: listing, error } = await databaseService.createListing(req.body);
            if (error) {
                return res.status(500).json({ error: 'Failed to create listing' });
            }
            res.json(listing);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create listing' });
        }
    },

    async cancelListing(req: Request, res: Response) {
        res.json({ success: true });
    }
};

