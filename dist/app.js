"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_1 = __importDefault(require("./middleware/error"));
const ebayNotificationRoute_1 = require("./routes/ebay/ebayNotificationRoute");
const searchRoute_1 = require("./routes/search/searchRoute");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/ebay/notifications", ebayNotificationRoute_1.ebayNotificationRouter);
app.use("/api/search", searchRoute_1.searchRouter);
app.get("/", (req, res) => {
    res.json({ message: "Good Flippin Deals App!" });
});
app.use(error_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map