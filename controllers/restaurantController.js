import Restaurant from '../models/Restaurant.js';
import Vendor from '../models/Vendor.js';
import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
// import { API_PATH } from '../../frontend/src/path/apiPath.js';

// Create a new restaurant
export const createRestaurant = async (req, res) => {
  const { name, dishes } = req.body;
  const vendorId = req.user.id; // Vendor authenticated

  try {
    // Check if the vendor already has a restaurant
    const existingRestaurant = await Restaurant.findOne({ vendor: vendorId });
    if (existingRestaurant) {
      return res.status(400).json({ message: "Vendor already has a restaurant" });
    }

    // Create a new restaurant
    const restaurant = new Restaurant({ name, vendor: vendorId, dishes });
    await restaurant.save();

    res.status(201).json({ message: "Restaurant created successfully", restaurant });
  } catch (error) {
    res.status(500).json({ message: "Error creating restaurant", error });
  }
};

// GET /api/restaurants
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find(); // Adjust based on your schema
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', error });
  }
};


// Get a restaurant by vendor ID
export const getRestaurantByVendor = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ vendor: req.user.id }).populate('vendor');
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurant", error });
  }
};

// Update restaurant details
export const updateRestaurant = async (req, res) => {
  const { name, dishes } = req.body;
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { vendor: req.user.id },
      { name, dishes },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json({ message: "Restaurant updated successfully", restaurant });
  } catch (error) {
    res.status(500).json({ message: "Error updating restaurant", error });
  }
};

// Delete a restaurant
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndDelete({ vendor: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting restaurant", error });
  }
};


// Add a new dish to the restaurant
export const addDish = async (req, res) => {
  console.log("Decoded user:", req.user);

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized: No valid user ID" });
  }

  try {
    // Find the restaurant by vendor ID
    const restaurant = await Restaurant.findOne({ vendor: req.user.id });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Construct public image URL using Render's domain
    const fileName = req.file.filename;
    const baseUrl = process.env.RENDER_EXTERNAL_URL || "https://backend-q31y.onrender.com";
    const imagePath = `${baseUrl}/uploads/${fileName}`;

    const newDish = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: imagePath,
    };

    restaurant.dishes.push(newDish);
    await restaurant.save();

    res.status(201).json({ message: "Dish added successfully", dish: newDish });
  } catch (error) {
    console.error("Error adding dish:", error);
    res.status(500).json({ message: "Error adding dish", error });
  }
};



// Delete a dish from the restaurant
export const deleteDish = async (req, res) => {
  const { dishId } = req.params; // Assuming dish ID is passed as a URL parameter

  try {
    // Find the restaurant by vendor
    const restaurant = await Restaurant.findOne({ vendor: req.user.id });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Find the dish by its ID and remove it from the dishes array
    const dishIndex = restaurant.dishes.findIndex((dish) => dish._id.toString() === dishId);

    if (dishIndex === -1) {
      return res.status(404).json({ message: "Dish not found" });
    }

    // Remove the dish from the dishes array
    restaurant.dishes.splice(dishIndex, 1);
    await restaurant.save();

    res.status(200).json({ message: "Dish deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting dish", error });
  }
};

// Update a dish in the restaurant
export const updateDish = async (req, res) => {
  const { dishId } = req.params; // Assuming dish ID is passed as a URL parameter
  const { name, description, price, image } = req.body;

  try {
    // Find the restaurant by vendor
    const restaurant = await Restaurant.findOne({ vendor: req.user.id });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Find the dish by its ID and update the details
    const dish = restaurant.dishes.find((dish) => dish._id.toString() === dishId);

    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    // Update the dish properties
    dish.name = name || dish.name;
    dish.description = description || dish.description;
    dish.price = price || dish.price;
    dish.image = image || dish.image;

    await restaurant.save();

    res.status(200).json({ message: "Dish updated successfully", dish });
  } catch (error) {
    res.status(500).json({ message: "Error updating dish", error });
  }
};

// Get all dishes of the restaurant

export const getDishes = async (req, res) => {
  try {
      if (!req.user || !req.user.id) {
          return res.status(401).json({ message: "Unauthorized: No valid user ID" });
      }

      const restaurant = await Restaurant.findOne({ vendor: req.user.id });
      if (!restaurant) {
          return res.status(404).json({ message: "Restaurant not found" });
      }

      // Format dishes with proper image URLs
      const formattedDishes = restaurant.dishes.map(dish => ({
          ...dish.toObject(),
          image: `https://backend-q31y.onrender.com/${dish.image.replace(/\\/g, "/")}`
      }));

      res.json(formattedDishes || []);
  } catch (error) {
      console.error("Error fetching dishes: ", error);
      res.status(500).json({ message: "Error fetching dishes", error });
  }
};


