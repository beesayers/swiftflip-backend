"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signout = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userSessionModel_1 = require("../../models/userSessionModel");
exports.signout = (0, express_async_handler_1.default)(async (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    // Verify that the token is present
    if (token == null) {
        res.status(401);
        throw new Error("Unauthorized - No token");
    }
    // Find the session by token, and populate the user data
    const session = await userSessionModel_1.UserSessionModel.findOne({ token }).populate("user", "-password");
    if (session == null) {
        res.status(404);
        throw new Error("Session not found");
    }
    // Revoke the session
    if (session.user != null) {
        await session.user.revokeSession(token);
        res.json({ message: "Logout successful. Token: " + token });
    }
    // Pass on to logging middleware
    req.session = session;
    next();
});
//# sourceMappingURL=signoutController.js.map