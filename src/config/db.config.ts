import mongoose from "mongoose";
import { config } from "./app.config";

const connectDB = async (): Promise<void> => {
  try {
    console.log(`Connecting to database... ${config.mongodbUrl} `);

    await mongoose.connect(config.mongodbUrl);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
