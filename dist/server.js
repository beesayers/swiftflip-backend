"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const error_1 = __importDefault(require("./middleware/error"));
const notifications_1 = __importDefault(require("./routes/ebay/notifications"));
dotenv_1.default.config();
void (0, db_1.default)();
const app = (0, express_1.default)();
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : "";
const host = (_b = process.env.HOST) !== null && _b !== void 0 ? _b : "";
app.use(express_1.default.json());
app.use("/api/ebay/notifications", notifications_1.default);
// return a message when you hit the root route, all in typescript
app.get("/", (req, res) => {
    res.json({ message: "Good Flippin Deals App!" });
});
// error handler
app.use(error_1.default);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
});
//# sourceMappingURL=server.js.map