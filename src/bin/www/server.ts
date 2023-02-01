import dotenv from "dotenv";
import app from "../../app";
import connectDB from "../../config/db";

dotenv.config();
void connectDB();

const port = process.env.PORT ?? "";
const host = process.env.HOST ?? "";

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
});
