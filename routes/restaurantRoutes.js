import express from 'express';
import {
  getAllRestaurants,
  addDish,
  deleteDish,
  updateDish,
  getDishes
} from '../controllers/restaurantController.js';
import Restaurant from '../models/Restaurant.js';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

// Restaurant managing routes (Vendor protected)
router.get('/getresturants', getAllRestaurants); // Get all restaurants

router.get('/:id/dishes', async (req, res) => {
  const { id } = req.params;

  try {
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({
      restaurantName: restaurant.name,
      dishes: restaurant.dishes,
    });
  } catch (error) {
    console.error('Error fetching restaurant dishes:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

// Dish management routes
router.post("/dishes", authMiddleware,upload.single("image"), addDish);
router.get('/dishes', authMiddleware, getDishes);           // Get all dishes
router.put('/dishes/:dishId', authMiddleware, updateDish); // Update a dish
router.delete('/dishes/:dishId', authMiddleware, deleteDish); // Delete a dish

export default router;
