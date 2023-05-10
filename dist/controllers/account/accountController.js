"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfilePicture = exports.deleteUserAccount = exports.updateUserAccount = exports.getUserAccount = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const stream_1 = require("stream");
const config_1 = __importDefault(require("../../config/config"));
const userAccountModel_1 = require("../../models/userAccountModel");
const userActivityModel_1 = require("../../models/userActivityModel");
const userSessionModel_1 = require("../../models/userSessionModel");
exports.getUserAccount = (0, express_async_handler_1.default)(async (req, res, next) => {
    // Check if the session is present
    if (req.session == null) {
        res.status(401);
        throw new Error("Unauthorized - No session");
    }
    // Return the user data in the response
    res.json(req.session.userAccount);
});
exports.updateUserAccount = (0, express_async_handler_1.default)(async (req, res, next) => {
    var _a, _b, _c;
    // Check if the session is present
    if (req.session == null) {
        res.status(401);
        throw new Error("Unauthorized - No session");
    }
    // Update the user data
    req.session.userAccount.firstName = (_a = req.body.firstName) !== null && _a !== void 0 ? _a : req.session.userAccount.firstName;
    req.session.userAccount.lastName = (_b = req.body.lastName) !== null && _b !== void 0 ? _b : req.session.userAccount.lastName;
    req.session.userAccount.email = (_c = req.body.email) !== null && _c !== void 0 ? _c : req.session.userAccount.email;
    req.body.password != null && (req.session.userAccount.password = req.body.password);
    try {
        // save the updated user data, and return the record without the password
        const updatedUserAccount = await req.session.userAccount.save();
        res.json({
            message: "User account updated successfully",
            userAccount: {
                _id: updatedUserAccount._id,
                firstName: updatedUserAccount.firstName,
                lastName: updatedUserAccount.lastName,
                email: updatedUserAccount.email,
                createdAt: updatedUserAccount.createdAt,
                updatedAt: updatedUserAccount.updatedAt,
                __v: updatedUserAccount.__v,
            },
        });
    }
    catch (error) {
        res.status(400);
        throw new Error("Invalid email or password");
    }
});
exports.deleteUserAccount = (0, express_async_handler_1.default)(async (req, res, next) => {
    // Check if the session is present
    if (req.session == null) {
        res.status(401);
        throw new Error("Unauthorized - No session");
    }
    // Delete user sessions
    await userSessionModel_1.UserSessionModel.deleteMany({ user: req.session.userAccount._id });
    // Delete user activity records
    await userActivityModel_1.UserActivityModel.deleteMany({ user: req.session.userAccount._id });
    // Delete the user account
    const deletedUserAccount = await userAccountModel_1.UserAccountModel.findByIdAndDelete(req.session.userAccount._id);
    if (deletedUserAccount != null) {
        res.json({ message: "User account deleted", userAccount: deletedUserAccount });
    }
    else {
        res.status(404);
        throw new Error("User not found");
    }
});
exports.updateProfilePicture = (0, express_async_handler_1.default)(async (req, res, next) => {
    // Check if the session is present
    if (req.session == null) {
        res.status(401);
        throw new Error("Unauthorized - No session");
    }
    const userAccountId = req.session.userAccount._id;
    // Check if the file is provided in the request
    if (req.file == null) {
        res.status(400);
        throw new Error("No file provided");
    }
    try {
        // Create a readable stream from the uploaded image buffer
        const readableStream = new stream_1.Readable();
        readableStream.push(req.file.buffer);
        readableStream.push(null);
        // Upload the image to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = config_1.default.cloudinary.uploader.upload_stream({
                folder: "profile_pictures/",
                public_id: userAccountId.toString(),
                transformation: [{ width: 150, height: 150, crop: "fill" }],
            }, (error, result) => {
                if (result != null) {
                    resolve(result);
                }
                else {
                    reject(error);
                }
            });
            readableStream.pipe(uploadStream);
        });
        // Update the user's profile photo URL in the database
        const userAccount = await userAccountModel_1.UserAccountModel.findByIdAndUpdate(userAccountId, { profilePicture: { url: result.url } }, { new: true });
        if (userAccount == null) {
            res.status(404);
            throw new Error("User account not found");
        }
        res.status(200).json({ message: "Profile picture updated", userAccount });
    }
    catch (error) {
        console.error(error);
        res.status(500);
        next(error);
    }
});
//# sourceMappingURL=accountController.js.map