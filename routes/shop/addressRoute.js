import { addAddress, deleteAddress, getAllAddress, updateAddress } from "../../controllers/shopping/addressController.js";
import { Router } from 'express';


const router = Router();

router.post('/add', addAddress);
router.get('/get/:userId', getAllAddress);
router.delete('/delete/:userId/:addressId', deleteAddress);
router.put('/update/:userId/:addressId', updateAddress);

export default router;
