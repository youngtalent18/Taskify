import express from 'express';
import { registerUser, loginUser, logoutUser, refresh_token, getUserProfile } from '../controllers/authController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh_token', refresh_token);
router.get('/profile', protectRoute, getUserProfile);

export default router;
