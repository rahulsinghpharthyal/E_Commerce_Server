import {Router} from 'express';
import { addToCart, allCartItem, removeToCart, updateCartItem } from '../../controllers/shopping/cartController.js';

const router = Router();

router.post('/add', addToCart);
router.get('/get/:userId', allCartItem);
router.put('/update-cart', updateCartItem);
router.delete('/:userId/:productId', removeToCart);

export default router;