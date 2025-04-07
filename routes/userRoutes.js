import express from 'express';
import { registerUser, loginUser ,getCurrentUser} from '../controllers/userController.js';

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', getCurrentUser);

export default router;
