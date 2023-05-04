"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userSessionModel_1 = require("../../models/userSessionModel");
exports.logout = (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    try {
        if (token == null) {
            res.status(401).json({ error: "Unauthorized" });
        }
        const session = await userSessionModel_1.UserSessionModel.findOne({ token }).populate("user", "-password");
        if (session == null) {
            res.status(404).json({ error: "Session not found" });
        }
        if ((session === null || session === void 0 ? void 0 : session.user) != null) {
            await session.user.revokeSession(token);
            res.json({ message: "Logout successful" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
//# sourceMappingURL=logoutController.js.map