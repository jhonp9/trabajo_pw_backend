import express from 'express';
import {
  getGameReviews,
  createGameReview,
} from '../controllers/reviews.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();


router.get('/:gameId', getGameReviews);
router.post('/:gameId', authenticate, createGameReview);

export default router;