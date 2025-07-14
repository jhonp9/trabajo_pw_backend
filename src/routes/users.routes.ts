import { Router } from 'express';
import {
  getUsersList,
  getUserDetails,
  updateUser,
  deleteUser,
  checkGamePurchase
} from '../controllers/users.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeAdmin } from '../middlewares/admin.middleware';

const router = Router();

router.get('/', authenticate, authorizeAdmin, getUsersList);
router.get('/:id', authenticate, authorizeAdmin, getUserDetails);
router.put('/:id', authenticate, authorizeAdmin, updateUser);
router.delete('/:id', authenticate, authorizeAdmin, deleteUser);
router.get('/:userId/purchases/check-game/:gameId', authenticate, checkGamePurchase);

export default router;