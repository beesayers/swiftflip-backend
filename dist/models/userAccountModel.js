"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccountModel = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const luxon_1 = require("luxon");
const mongoose_1 = __importStar(require("mongoose"));
const userActivityModel_1 = require("./userActivityModel");
const userSessionModel_1 = require("./userSessionModel");
const userAccountSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
            },
            message: "Please enter a valid email address",
        },
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    subscription: {
        type: String,
        enum: ["free", "pro", "pro-x"],
        default: "free",
    },
    profilePicture: {
        url: String,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}$/.test(v);
            },
            message: "Password must be at least 8 characters long and contain at least one number and one special character",
        },
    },
    userSessions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "UserSession" }],
    searchHistory: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Search" }],
    userActivity: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "UserActivity" }],
}, { timestamps: true });
// Before saving a new user or updating an existing user, hash the password if it has been modified
userAccountSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
        return;
    }
    try {
        const salt = await bcrypt_1.default.genSalt(10);
        this.password = await bcrypt_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
userAccountSchema.methods.createSession = async function () {
    // Create a new session
    const session = new userSessionModel_1.UserSessionModel({
        userAccount: this._id,
        token: crypto_1.default.randomBytes(16).toString("hex"),
        expiresAt: luxon_1.DateTime.local().plus({ days: 7 }).toJSDate(),
    });
    await session.save();
    // Add the session to the user's sessions array
    await exports.UserAccountModel.findOneAndUpdate({ _id: this._id }, { $push: { userSessions: session._id } });
    return session;
};
userAccountSchema.methods.createActivity = async function (activityType, activityDetails) {
    // Create a new activity
    const userActivity = new userActivityModel_1.UserActivityModel({
        userAccount: this._id,
        activityType,
        activityDetails,
        createdAt: new Date(),
    });
    await userActivity.save();
    // Add the activity to the user's activities array
    await exports.UserAccountModel.findOneAndUpdate({ _id: this._id }, { $push: { userActivity: userActivity._id } });
    return userActivity;
};
userAccountSchema.methods.revokeSession = async function (token) {
    const session = await userSessionModel_1.UserSessionModel.findOneAndDelete({ token, userAccount: this._id });
    await exports.UserAccountModel.findOneAndUpdate({ _id: this._id }, { $pull: { userSessions: session === null || session === void 0 ? void 0 : session._id } });
    if (session === null) {
        throw new Error("Session not found");
    }
    return session;
};
userAccountSchema.methods.comparePassword = async function (password) {
    // Compare the plaintext password with the hashed password stored in the database
    const isMatch = await bcrypt_1.default.compare(password, this.password);
    return isMatch;
};
exports.UserAccountModel = mongoose_1.default.model("UserAccount", userAccountSchema);
//# sourceMappingURL=userAccountModel.js.map