"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const config = {
    db: {
        uri: (_a = process.env.MONGO_URI) !== null && _a !== void 0 ? _a : "",
    },
    server: {
        port: (_b = process.env.PORT) !== null && _b !== void 0 ? _b : "",
        host: (_c = process.env.HOST) !== null && _c !== void 0 ? _c : "",
    },
    cloudinary: cloudinary_1.v2,
    ebay: {
        endpointProd: (_d = process.env.EBAY_ENDPOINT_PROD) !== null && _d !== void 0 ? _d : "",
        appidProd: (_e = process.env.EBAY_APPID_PROD) !== null && _e !== void 0 ? _e : "",
    },
};
exports.default = config;
//# sourceMappingURL=config.js.map