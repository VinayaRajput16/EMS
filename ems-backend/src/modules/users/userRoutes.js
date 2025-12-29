import { Router } from 'express';
import { userController } from './userController.js';
import { requireRole } from '../../common/middleware/roleMiddleware.js';

const router = Router();

// self
router.get('/me', userController.getMe);
router.patch('/me', userController.updateMe);

// admin
router.get('/', requireRole('ADMIN'), userController.list);
router.patch('/:id/block', requireRole('ADMIN'), userController.block);

export default router;
