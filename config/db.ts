import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const MONGO_URI: string = process.env.MONGO_URI || "";
    const conn = await mongoose.connect(MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
