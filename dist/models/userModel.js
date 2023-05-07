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
exports.UserModel = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const luxon_1 = require("luxon");
const mongoose_1 = __importStar(require("mongoose"));
const userSessionModel_1 = require("./userSessionModel");
const userSchema = new mongoose_1.Schema({
    userActivity: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    userSessions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "UserSession" }],
    searchHistory: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Search" }],
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
}, { timestamps: true });
// Before saving a new user or updating an existing user, hash the password if it has been modified
userSchema.pre("save", async function (next) {
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
userSchema.methods.createSession = async function () {
    const session = new userSessionModel_1.UserSessionModel({
        user: this._id,
        token: crypto_1.default.randomBytes(16).toString("hex"),
        expiresAt: luxon_1.DateTime.local().plus({ days: 7 }).toJSDate(),
    });
    await session.save();
    return session;
};
userSchema.methods.revokeSession = async function (token) {
    const session = await userSessionModel_1.UserSessionModel.findOneAndDelete({ token, user: this._id });
    if (session === null) {
        throw new Error("Session not found");
    }
    return session;
};
userSchema.methods.comparePassword = async function (password) {
    // Compare the plaintext password with the hashed password stored in the database
    const isMatch = await bcrypt_1.default.compare(password, this.password);
    return isMatch;
};
exports.UserModel = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=userModel.js.map