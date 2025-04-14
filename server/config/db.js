import mongoose from "mongoose";

// COMMENT: This function connects to the MongoDB database using Mongoose.
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongodb connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); //1 means failure, 0 success
  }
};
