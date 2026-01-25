import { Router } from 'express';
import { gridController } from '../controllers/grid.controller';
import { playerController } from '../controllers/player.controller';
import { battleController } from '../controllers/battle.controller';
import { marketplaceController } from '../controllers/marketplace.controller';

const router = Router();

// Grid routes
router.get('/grid/state', gridController.getState);
router.get('/grid/territories', gridController.getAllTerritories);
router.get('/grid/territory/:x/:y', gridController.getTerritory);

// Player routes
router.get('/player/:wallet', playerController.getProfile);
router.get('/player/:wallet/territories', playerController.getTerritories);
router.get('/player/:wallet/revenue', playerController.getRevenue);
router.get('/player/:wallet/battles', playerController.getBattles);
router.post('/player/:wallet/update', playerController.updateProfile);

// Battle routes
router.get('/battles/active', battleController.getActiveBattles);
router.get('/battles/history', battleController.getBattleHistory);
router.get('/battles/:id', battleController.getBattle);

// Marketplace routes
router.get('/marketplace/listings', marketplaceController.getListings);
router.post('/marketplace/list', marketplaceController.createListing);
router.delete('/marketplace/listing/:id', marketplaceController.cancelListing);

// Stats routes
router.get('/stats/global', gridController.getGlobalStats);
router.get('/stats/leaderboard', playerController.getLeaderboard);

export default router;
