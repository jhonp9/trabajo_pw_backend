import { Router } from 'express';
import {
  getNewsList,
  getNewsItem,
  createNews,
  updateNews,
  deleteNews
} from '../controllers/news.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeAdmin } from '../middlewares/admin.middleware';

const router = Router();

router.get('/', getNewsList);
router.get('/:id', getNewsItem);
router.post('/', authenticate, authorizeAdmin, createNews);
router.put('/:id', authenticate, authorizeAdmin, updateNews);
router.delete('/:id', authenticate, authorizeAdmin, deleteNews);

export default router;