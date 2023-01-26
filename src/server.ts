import dotenv from "dotenv";
import express, { Request, Response } from "express";
import connectDB from "./config/db";
import errorHandler from "./middleware/error";
import ebayNotificationRouter from "./routes/ebay/notifications";

dotenv.config();
void connectDB();

const app = express();
const port = process.env.PORT ?? "";
const host = process.env.HOST ?? "";

app.use(express.json());
app.use("/api/ebay/notifications", ebayNotificationRouter);

// return a message when you hit the root route, all in typescript
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Good Flippin Deals App!" });
});

// error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
});
