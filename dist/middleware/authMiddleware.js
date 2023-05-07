"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userSessionModel_1 = require("../models/userSessionModel");
exports.requireAuth = (0, express_async_handler_1.default)(async (req, res, next) => {
    var _a;
    // Get the token from the header
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    // Check if the token is present
    if (token == null) {
        res.status(401);
        throw new Error("Unauthorized - No token");
    }
    // Find the session
    const session = await userSessionModel_1.UserSessionModel.findOne({ token }).populate("userAccount", "-password");
    if (session == null) {
        res.status(401);
        throw new Error("Unauthorized - No session");
    }
    // Check if the token is valid
    const validToken = await (session === null || session === void 0 ? void 0 : session.isValidToken(token));
    if (!validToken) {
        res.status(401);
        throw new Error("Unauthorized - Invalid token");
    }
    req.session = session;
    next();
});
//# sourceMappingURL=authMiddleware.js.map