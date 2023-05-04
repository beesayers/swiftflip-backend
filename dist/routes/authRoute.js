"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const signinController_1 = require("../controllers/auth/signinController");
const signoutController_1 = require("../controllers/auth/signoutController");
const signupController_1 = require("../controllers/auth/signupController");
const userController_1 = require("../controllers/user/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const userActivityMiddleware_1 = require("../middleware/userActivityMiddleware");
exports.authRouter = express_1.default.Router();
exports.authRouter.post("/signin", signinController_1.signin, userActivityMiddleware_1.logUserActivity);
exports.authRouter.post("/signout", signoutController_1.signout, userActivityMiddleware_1.logUserActivity);
exports.authRouter.post("/signup", signupController_1.signup, userActivityMiddleware_1.logUserActivity);
exports.authRouter.get("/profile", authMiddleware_1.requireAuth, userActivityMiddleware_1.logUserActivity, userController_1.getUserProfile);
exports.authRouter.put("/profile", authMiddleware_1.requireAuth, userActivityMiddleware_1.logUserActivity, userController_1.updateUserProfile);
exports.authRouter.delete("/profile", authMiddleware_1.requireAuth, userActivityMiddleware_1.logUserActivity, userController_1.deleteUserProfile);
//# sourceMappingURL=authRoute.js.map