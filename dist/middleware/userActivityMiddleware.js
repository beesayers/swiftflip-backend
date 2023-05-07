"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logUserActivity = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
exports.logUserActivity = (0, express_async_handler_1.default)(async (req, res, next) => {
    // log signin, signout, signup, and status activity
    if ((req.path === "/signin" || req.path === "/signout" || req.path === "/signup" || req.path === "/status") &&
        req.session != null) {
        const userActivity = await req.session.userAccount.createActivity(`${req.method} ${req.path}`, req.path.slice(1, req.path.length));
    }
    // Log account activity
    if (req.path === "/account" && req.session != null) {
        const details = req.method === "GET" ? "Viewed profile" : req.method === "PUT" ? "Updated profile" : "Deleted profile";
        const userActivity = await req.session.userAccount.createActivity(`${req.method} ${req.path}`, details);
    }
    next();
});
//# sourceMappingURL=userActivityMiddleware.js.map