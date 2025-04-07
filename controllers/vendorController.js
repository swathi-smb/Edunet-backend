import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Vendor from '../models/Vendor.js';
import dotenv from 'dotenv';
import Restaurant from '../models/Restaurant.js';
import mongoose from 'mongoose';
dotenv.config();
// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;
console.log("jwt token:",JWT_SECRET);

// Vendor Signup
export const registerVendor = async (req, res) => {
  const { email, password, restaurant_name } = req.body;
  console.log("🔹 Received vendor registration request:", { email, restaurant_name });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingVendor = await Vendor.findOne({ email }).session(session);
    if (existingVendor) {
      await session.abortTransaction();
      console.log("❌ Vendor already exists:", existingVendor);
      return res.status(400).json({ message: "Vendor already exists" });
    }

    console.log("🔹 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("🔹 Creating vendor and restaurant...");
    const restaurant = new Restaurant({
      name: restaurant_name,
      email: email
    });

    const vendor = new Vendor({
      email,
      password: hashedPassword,
      restaurant: restaurant._id
    });

    restaurant.vendor = vendor._id;

    await restaurant.save({ session });
    await vendor.save({ session });
    await session.commitTransaction();
    console.log("✅ Vendor and restaurant created successfully");

    res.status(201).json({
      message: "Vendor registered successfully",
      vendorId: vendor._id,
      restaurantId: restaurant._id,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("❌ Error registering vendor:", error);
    res.status(500).json({ 
      message: "Error registering vendor",
      error: error.message 
    });
  } finally {
    session.endSession();
  }
};


// Vendor Login
export const loginVendor = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if vendor exists
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(400).json({ message: "Vendor not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: vendor._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: "Login successful", token, vendor });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Get Vendor Details
export const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id).populate('restaurant_name');
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vendor profile", error });
  }
};
