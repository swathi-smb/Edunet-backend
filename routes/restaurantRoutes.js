import express from 'express';
import { createRestaurant } from '../controllers/restaurantController.js';

const router = express.Router();

// Route for creating a restaurant
router.post('/create', createRestaurant);

export default router;
