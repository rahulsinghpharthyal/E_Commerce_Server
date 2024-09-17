import { Router } from 'express';
import { capturePayment, createOrder } from '../../controllers/shopping/orderController.js';
 
const router = Router();

router.post('/create', createOrder);
router.post('/capture-payment', capturePayment);

export default router;