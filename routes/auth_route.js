import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/auth_controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import authenticate from "../controllers/authenticateController.js";

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/check-auth', isAuthenticated, authenticate);

export default router;