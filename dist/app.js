"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
const accountRoute_1 = require("./routes/accountRoute");
const authRoute_1 = require("./routes/authRoute");
const ebayNotificationRoute_1 = require("./routes/ebayNotificationRoute");
const searchRoute_1 = require("./routes/searchRoute");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/ebay/notifications", ebayNotificationRoute_1.ebayNotificationRouter);
app.use("/api/search", searchRoute_1.searchRouter);
app.use("/api/auth", authRoute_1.authRouter);
app.use("/api/account", accountRoute_1.accountRouter);
app.use(errorMiddleware_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map