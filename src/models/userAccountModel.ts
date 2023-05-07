import bcrypt from "bcrypt";
import crypto from "crypto";
import { DateTime } from "luxon";
import mongoose, { Schema } from "mongoose";
import { IUserAccount } from "../config/types";
import { UserActivityModel } from "./userActivityModel";
import { UserSessionModel } from "./userSessionModel";

const userAccountSchema = new Schema<IUserAccount>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v: string) {
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
        validator: function (v: string) {
          return /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}$/.test(v);
        },
        message:
          "Password must be at least 8 characters long and contain at least one number and one special character",
      },
    },
    userSessions: [{ type: Schema.Types.ObjectId, ref: "UserSession" }],
    searchHistory: [{ type: Schema.Types.ObjectId, ref: "Search" }],
    userActivity: [{ type: Schema.Types.ObjectId, ref: "UserActivity" }],
  },
  { timestamps: true }
);

// Before saving a new user or updating an existing user, hash the password if it has been modified
userAccountSchema.pre<IUserAccount>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any | unknown) {
    next(error);
  }
});

userAccountSchema.methods.createSession = async function () {
  // Create a new session
  const session = new UserSessionModel({
    userAccount: this._id,
    token: crypto.randomBytes(16).toString("hex"),
    expiresAt: DateTime.local().plus({ days: 7 }).toJSDate(),
  });
  await session.save();

  // Add the session to the user's sessions array
  await UserAccountModel.findOneAndUpdate({ _id: this._id }, { $push: { userSessions: session._id } });

  return session;
};

userAccountSchema.methods.createActivity = async function (activityType: string, activityDetails: string) {
  // Create a new activity
  const userActivity = new UserActivityModel({
    userAccount: this._id,
    activityType,
    activityDetails,
    createdAt: new Date(),
  });
  await userActivity.save();

  // Add the activity to the user's activities array
  await UserAccountModel.findOneAndUpdate({ _id: this._id }, { $push: { userActivity: userActivity._id } });

  return userActivity;
};

userAccountSchema.methods.revokeSession = async function (token: string) {
  const session = await UserSessionModel.findOneAndDelete({ token, userAccount: this._id });
  await UserAccountModel.findOneAndUpdate({ _id: this._id }, { $pull: { userSessions: session?._id } });

  if (session === null) {
    throw new Error("Session not found");
  }

  return session;
};

userAccountSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  // Compare the plaintext password with the hashed password stored in the database
  const isMatch = await bcrypt.compare(password, this.password);

  return isMatch;
};

export const UserAccountModel = mongoose.model<IUserAccount>("UserAccount", userAccountSchema);
