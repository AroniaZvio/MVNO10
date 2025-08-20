import { Router } from 'express';
import { getAll, createOne, updateOne, removeOne, listPublicSimple } from './controllers';
import { requireAuth, requireAdmin } from '../../../middleware/auth';

const router = Router();

// === Публично для кабинета пользователя (read-only) ===
router.get('/public', listPublicSimple);

// === Админ как было ===
router.get('/', getAll);
router.post('/', requireAuth, requireAdmin, createOne);
router.put('/:id', requireAuth, requireAdmin, updateOne);
router.delete('/:id', requireAuth, requireAdmin, removeOne);

export default router;
