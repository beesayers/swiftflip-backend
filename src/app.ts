import cors from "cors";
import express, { Request, Response } from "express";
import errorHandler from "./middleware/errorMiddleware";
import { authRouter } from "./routes/authRoute";
import { ebayNotificationRouter } from "./routes/ebayNotificationRoute";
import { searchRouter } from "./routes/searchRoute";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/ebay/notifications", ebayNotificationRouter);
app.use("/api/search", searchRouter);
app.use("/api/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Flip Swiftly, My Friend." });
});

app.use(errorHandler);

export default app;
