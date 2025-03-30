import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`MongoDB URI: ${uri}`); // Log the URI for debugging

  } catch (error) {
    console.error(`❌ Error: ${error.message}`); 
    console.error('Failed to connect to MongoDB. Please check your connection string and network settings.'); // Additional error message

    process.exit(1);
  }
};

export default connectDB;
