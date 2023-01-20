import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();
void connectDB();

const app = express();
const port = process.env.PORT ?? "8000";

app.use(express.json());

// return a message when you hit the root route, all in typescript
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Good Flippin Deals App!" });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
