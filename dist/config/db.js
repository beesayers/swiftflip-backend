"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set("strictQuery", false);
const connectDB = async () => {
    var _a;
    try {
        const MONGO_URI = (_a = process.env.MONGO_URI) !== null && _a !== void 0 ? _a : "";
        const conn = await mongoose_1.default.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error (${error.name}): ${error.message}`);
        }
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map