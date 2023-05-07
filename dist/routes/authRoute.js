"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/auth/authController");
const userActivityMiddleware_1 = require("../middleware/userActivityMiddleware");
exports.authRouter = express_1.default.Router();
exports.authRouter.post("/signin", authController_1.signin, userActivityMiddleware_1.logUserActivity);
exports.authRouter.post("/signout", authController_1.signout, userActivityMiddleware_1.logUserActivity);
exports.authRouter.post("/signup", authController_1.signup, userActivityMiddleware_1.logUserActivity);
exports.authRouter.get("/status", authController_1.checkAuthStatus, userActivityMiddleware_1.logUserActivity);
//# sourceMappingURL=authRoute.js.map