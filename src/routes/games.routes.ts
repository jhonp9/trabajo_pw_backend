import { Router } from 'express';
import {
  getGamesList,
  getGameDetails,
  createGame,
  updateGame,
  deleteGame,
  addGameReview,
  purchaseGame,
  processPurchase
} from '../controllers/games.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeAdmin } from '../middlewares/admin.middleware';

const router = Router();

router.get('/', getGamesList);
router.get('/:id', getGameDetails);
router.post('/', authenticate, authorizeAdmin, createGame);
router.put('/:id', authenticate, authorizeAdmin, updateGame);
router.delete('/:id', authenticate, authorizeAdmin, deleteGame);
router.post('/:gameId/reviews', authenticate, addGameReview);
router.post('/:gameId/purchase', authenticate, purchaseGame);
router.post('/process-purchase', authenticate, processPurchase);
export default router;