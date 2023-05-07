import cors from "cors";
import express from "express";
import connectDB from "./config/db";
import errorHandler from "./middleware/errorMiddleware";
import { accountRouter } from "./routes/accountRoute";
import { authRouter } from "./routes/authRoute";
import { ebayNotificationRouter } from "./routes/ebayNotificationRoute";
import { searchRouter } from "./routes/searchRoute";

const app = express();
void connectDB();
app.use(cors());
app.use(express.json());
app.use("/api/ebay/notifications", ebayNotificationRouter);
app.use("/api/search", searchRouter);
app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter);
app.use(errorHandler);

export default app;
