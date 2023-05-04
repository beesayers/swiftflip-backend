"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = require("../../models/userModel");
exports.signin = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    // Verify that the email and password fields are present
    if (email.length === 0 && password.length === 0) {
        res.status(400).json({ error: "Email and password are required" });
        return;
    }
    // Find the user by email
    const user = await userModel_1.UserModel.findOne({ email });
    if (user == null) {
        res.status(404);
        throw new Error("User not found");
    }
    // Verify the password using bcrypt
    const isMatch = await (user === null || user === void 0 ? void 0 : user.comparePassword(password));
    if (isMatch == null) {
        res.status(401);
        throw new Error("Incorrect password");
    }
    // Create a new user session
    const session = await (await (user === null || user === void 0 ? void 0 : user.createSession())).populate("user", "-password");
    // Return the session token and user data in the response
    res.json(session);
    // Pass on to logging middleware
    req.session = session;
    next();
});
//# sourceMappingURL=signinController.js.map