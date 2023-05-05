"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = require("../../models/userModel");
exports.signup = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    // Verify that the all fields are present
    if (firstName.length === 0 || lastName.length === 0 || email.length === 0 || password.length === 0) {
        res.status(400);
        throw new Error("All fields are required");
    }
    // Check if the email is already in use
    const existingUser = await userModel_1.UserModel.findOne({ email });
    if (existingUser != null) {
        res.status(400);
        throw new Error("User already exists");
    }
    // Create a new user
    const user = new userModel_1.UserModel({
        firstName,
        lastName,
        email,
        password,
    });
    // catch errors for duplicate emails and invalid emails and invalid passwords
    try {
        await user.save();
    }
    catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
    // Create a new user session
    const session = await (await user.createSession()).populate("user", "-password");
    if (session == null) {
        res.status(500);
        throw new Error("Session creation failed");
    }
    // Return the session token and user data in the response
    res.json(session);
    // Pass on to logging middleware
    req.session = session;
    next();
});
//# sourceMappingURL=signupController.js.map