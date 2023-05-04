"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserProfile = exports.updateUserProfile = exports.getUserProfile = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userActivityModel_1 = require("../../models/userActivityModel");
const userModel_1 = require("../../models/userModel");
const userSessionModel_1 = require("../../models/userSessionModel");
exports.getUserProfile = (0, express_async_handler_1.default)(async (req, res, next) => {
    // Check if the session is present
    if (req.session == null) {
        res.status(401);
        throw new Error("Unauthorized - No session");
    }
    // Return the user data in the response
    res.json(req.session.user);
});
exports.updateUserProfile = (0, express_async_handler_1.default)(async (req, res, next) => {
    var _a, _b, _c;
    // Check if the session is present
    if (req.session == null) {
        res.status(401);
        throw new Error("Unauthorized - No session");
    }
    // Update the user data
    req.session.user.firstName = (_a = req.body.firstName) !== null && _a !== void 0 ? _a : req.session.user.firstName;
    req.session.user.lastName = (_b = req.body.lastName) !== null && _b !== void 0 ? _b : req.session.user.lastName;
    req.session.user.email = (_c = req.body.email) !== null && _c !== void 0 ? _c : req.session.user.email;
    req.body.password != null && (req.session.user.password = req.body.password);
    const updatedUser = await req.session.user.save();
    res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
    });
});
exports.deleteUserProfile = (0, express_async_handler_1.default)(async (req, res, next) => {
    // Check if the session is present
    if (req.session == null) {
        res.status(401);
        throw new Error("Unauthorized - No session");
    }
    // Delete user sessions
    await userSessionModel_1.UserSessionModel.deleteMany({ user: req.session.user._id });
    // Delete user activity records
    await userActivityModel_1.UserActivityModel.deleteMany({ user: req.session.user._id });
    // Delete the user account
    const deletedUser = await userModel_1.UserModel.findByIdAndDelete(req.session.user._id);
    if (deletedUser != null) {
        res.json({ message: "User account deleted successfully", user: deletedUser });
    }
    else {
        res.status(404);
        throw new Error("User not found");
    }
});
//# sourceMappingURL=userController.js.map