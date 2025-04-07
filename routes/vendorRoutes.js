import express from 'express';
import { registerVendor, loginVendor, getVendorProfile } from '../controllers/vendorController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Vendor authentication routes
router.post('/register', registerVendor);
router.post('/login', loginVendor);
router.get('/profile', authMiddleware, getVendorProfile);

export default router;
