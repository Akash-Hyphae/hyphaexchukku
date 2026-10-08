import { Router } from 'express';
import { login, verify, logout, changePassword } from '../controllers/authController.ts';
import { requireAdminAuth } from '../middleware/auth.ts';

const router = Router();

router.post('/login', login);
router.get('/verify', requireAdminAuth, verify);
router.post('/logout', logout);
router.post('/change-password', requireAdminAuth, changePassword);

export default router;
