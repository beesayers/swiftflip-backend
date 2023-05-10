import mongoose from "mongoose";
import config from "../config/config";

mongoose.set("strictQuery", false);

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.db.uri);

    console.log(`⚡️⚡️[db]: MongoDB Connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error (${error.name}): ${error.message}`);
    }
    process.exit(1);
  }
};

export default connectDB;
