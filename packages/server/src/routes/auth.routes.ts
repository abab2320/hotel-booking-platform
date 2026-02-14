import { Router } from 'express';
import { register, login, profile, verify, resendVerification } from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware';
import { requireFields } from '../middleware/validate.middleware';

const router = Router();

router.post('/register', requireFields(['username', 'email', 'password']), register);
router.post('/login', requireFields(['email', 'password']), login);
router.post('/resend', resendVerification);
router.get('/verify', verify);
router.get('/profile', authMiddleware, profile);

export default router;
