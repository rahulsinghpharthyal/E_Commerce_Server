import { Router } from 'express';
import { capturePayment, createOrder, invoiceGenerate, sendInvoiceEmail } from '../../controllers/shopping/orderController.js';
 
const router = Router();

router.post('/create', createOrder);
router.post('/capture-payment', capturePayment);
router.post('/invoice', invoiceGenerate);
router.post('/send-invoice-email', sendInvoiceEmail);

export default router;