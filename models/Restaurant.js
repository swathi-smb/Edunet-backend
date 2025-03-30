// const mongoose = require("mongoose");
import mongoose from "mongoose";
export const RestaurantSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
//   address: { type: String, required: true },
//   phone: { type: String, required: true },
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" }],
//   createdAt: { type: Date, default: Date.now },
});


export default mongoose.model("Restaurant", RestaurantSchema);