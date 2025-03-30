import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
