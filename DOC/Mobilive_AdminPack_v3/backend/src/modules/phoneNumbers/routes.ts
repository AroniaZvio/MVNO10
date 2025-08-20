import { Router } from 'express';
import { getAll, createOne, updateOne, removeOne } from './controllers';
import { requireAdmin } from '../../middlewares/requireAdmin';

const router = Router();

router.get('/', getAll); // публичный для Dashboard
router.post('/', requireAdmin, createOne);
router.put('/:id', requireAdmin, updateOne);
router.delete('/:id', requireAdmin, removeOne);

export default router;
