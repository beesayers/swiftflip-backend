import express, { Request, Response } from "express";
import errorHandler from "./middleware/error";
import { ebayNotificationRouter } from "./routes/ebay/ebayNotificationRoute";
import { searchRouter } from "./routes/search/searchRoute";

const app = express();
app.use(express.json());
app.use("/api/ebay/notifications", ebayNotificationRouter);
app.use("/api/search", searchRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Good Flippin Deals App!" });
});

app.use(errorHandler);

export default app;
