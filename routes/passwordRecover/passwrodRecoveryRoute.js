import { Router } from 'express';
import { ResetPassword, sendLink } from '../../controllers/password_recoveryController.js';

const router = Router();

router.post('/send-link', sendLink);
router.post('/reset-password/:recovery_id', ResetPassword);

export default router;