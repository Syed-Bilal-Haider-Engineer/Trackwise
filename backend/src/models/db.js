import mongoose from "mongoose";

export default async function connectDB() {
  console.log("ENV CHECK:", process.env.MONGO_URI ? "MONGO_URI is set" : "MONGO_URI is NOT set");
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing. Set it in your environment variables.");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}