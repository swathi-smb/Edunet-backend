import Restaurant from '../models/Restaurant.js';

// Create Restaurant
export const createRestaurant = async (req, res) => {
  const { owner, name, menu } = req.body;

  // Validate input fields
  if (!owner || !name || !menu) {
    return res.status(400).json({ message: 'Owner, name, and menu are required.' });
  }

  // Check for duplicate restaurant name
  const existingRestaurant = await Restaurant.findOne({ name });
  if (existingRestaurant) {
    return res.status(400).json({ message: 'Restaurant name must be unique.' });
  }


  try {
    const newRestaurant = new Restaurant({ owner, name, menu });
    await newRestaurant.save();
    res.status(201).json({ message: 'Restaurant created successfully', restaurant: newRestaurant });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default createRestaurant;
