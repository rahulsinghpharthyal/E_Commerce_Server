import { Router } from "express";
import { addProduct, deleteProductById, getAllProducts, handleImageUpload, updateProductById } from "../../controllers/admin/productsController.js";
import { upload } from '../../helper/cloudinary.js';
const router = Router();

router.post("/upload-image", upload.single("file"), handleImageUpload);
router.post('/add-product', addProduct);
router.put('/update-product/:id', updateProductById);
router.delete('/delete-product/:id', deleteProductById);
router.get('/all-product', getAllProducts);

export default router;
