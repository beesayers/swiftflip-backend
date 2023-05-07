"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountRouter = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const accountController_1 = require("../controllers/account/accountController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const userActivityMiddleware_1 = require("../middleware/userActivityMiddleware");
exports.accountRouter = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
exports.accountRouter.get("/", authMiddleware_1.requireAuth, userActivityMiddleware_1.logUserActivity, accountController_1.getUserAccount);
exports.accountRouter.put("/", authMiddleware_1.requireAuth, userActivityMiddleware_1.logUserActivity, accountController_1.updateUserAccount);
exports.accountRouter.delete("/", authMiddleware_1.requireAuth, userActivityMiddleware_1.logUserActivity, accountController_1.deleteUserAccount);
exports.accountRouter.patch("/profile-picture", authMiddleware_1.requireAuth, upload.single("photo"), accountController_1.updateProfilePicture);
//# sourceMappingURL=accountRoute.js.map