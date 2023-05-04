"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = require("../../models/userModel");
exports.login = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    // Verify that the email and password fields are present
    if (email.length > 0 && password.length > 0) {
        res.status(400).json({ error: "Email and password are required" });
    }
    try {
        // Find the user by email
        const user = await userModel_1.UserModel.findOne({ email });
        if (user == null) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        // Verify the password using bcrypt
        const isMatch = await (user === null || user === void 0 ? void 0 : user.comparePassword(password));
        if (isMatch == null) {
            res.status(401).json({ error: "Incorrect password" });
            return;
        }
        // Create a new user session
        const session = await (user === null || user === void 0 ? void 0 : user.createSession());
        // Return the session token and user data in the response
        res.json({
            token: session === null || session === void 0 ? void 0 : session.token,
            user: {
                id: user === null || user === void 0 ? void 0 : user._id,
                email: user === null || user === void 0 ? void 0 : user.email,
                firstName: user === null || user === void 0 ? void 0 : user.firstName,
                lastName: user === null || user === void 0 ? void 0 : user.lastName,
                // Include any other user data that you want to expose
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
//# sourceMappingURL=loginController.js.map