"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ebayNotificationRouter = void 0;
const express_1 = __importDefault(require("express"));
const ebayNotificationController_1 = require("../controllers/ebay/ebayNotificationController");
const ebayNotificationRouter = express_1.default.Router();
exports.ebayNotificationRouter = ebayNotificationRouter;
// getting all
ebayNotificationRouter.route("/").get(ebayNotificationController_1.getEbayNotification);
//# sourceMappingURL=ebayNotificationRoute.js.map