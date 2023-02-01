"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("../../app"));
const db_1 = __importDefault(require("../../config/db"));
dotenv_1.default.config();
void (0, db_1.default)();
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : "";
const host = (_b = process.env.HOST) !== null && _b !== void 0 ? _b : "";
app_1.default.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
});
//# sourceMappingURL=server.js.map