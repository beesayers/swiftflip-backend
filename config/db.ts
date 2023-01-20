import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const connectDB = async (): Promise<void> => {
  try {
    const MONGO_URI: string = process.env.MONGO_URI ?? "";
    const conn = await mongoose.connect(MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error (${error.name}): ${error.message}`);
    }
    process.exit(1);
  }
};

export default connectDB;
