"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logUserActivity = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userActivityModel_1 = require("../models/userActivityModel");
exports.logUserActivity = (0, express_async_handler_1.default)(async (req, res, next) => {
    // log signin and signout
    if ((req.path === "/signin" || req.path === "/signout" || req.path === "/signup") && req.session != null) {
        await userActivityModel_1.UserActivityModel.create({
            user: req.session.user,
            activityType: `${req.method} ${req.path}`,
            activityDetails: req.path.slice(1, req.path.length),
            createdAt: new Date(),
        });
    }
    // Log user activity
    if (req.path === "/profile" && req.session != null) {
        const details = req.method === "GET" ? "Viewed profile" : req.method === "PUT" ? "Updated profile" : "Deleted profile";
        await userActivityModel_1.UserActivityModel.create({
            user: req.session.user,
            activityType: `${req.method} ${req.path}`,
            activityDetails: details,
            createdAt: new Date(),
        });
    }
    next();
});
//# sourceMappingURL=userActivityMiddleware.js.map