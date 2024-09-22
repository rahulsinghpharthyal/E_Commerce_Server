import { Router } from 'express';
import apiUsage from '../../controllers/apiUsage/apiUsageController.js';

const router = Router();

router.get('/usage-stats', apiUsage);

export default router;