import express from "express";
import { getEbayNotification } from "../../controllers/ebay/ebayNotificationController";
const ebayNotificationRouter = express.Router();

// getting all
ebayNotificationRouter.route("/").get(getEbayNotification);

// export default ebayNotificationRouter;
export { ebayNotificationRouter };
