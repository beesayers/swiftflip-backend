import bcrypt from "bcrypt";
import crypto from "crypto";
import { DateTime } from "luxon";
import mongoose, { Schema } from "mongoose";
import { IUser } from "../config/types";
import { UserSessionModel } from "./userSessionModel";

const userSchema = new Schema<IUser>(
  {
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
        validator: function (v: string) {
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
        validator: function (v: string) {
          return /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}$/.test(v);
        },
        message:
          "Password must be at least 8 characters long and contain at least one number and one special character",
      },
    },
  },
  { timestamps: true }
);

// Before saving a new user or updating an existing user, hash the password if it has been modified
userSchema.pre<IUser>("save", async function (next) {
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

userSchema.methods.createSession = async function () {
  const session = new UserSessionModel({
    user: this._id,
    token: crypto.randomBytes(16).toString("hex"),
    expiresAt: DateTime.local().plus({ days: 7 }).toJSDate(),
  });

  await session.save();

  return session;
};

userSchema.methods.revokeSession = async function (token: string) {
  const session = await UserSessionModel.findOneAndDelete({ token, user: this._id });

  if (session === null) {
    throw new Error("Session not found");
  }

  return session;
};

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  // Compare the plaintext password with the hashed password stored in the database
  const isMatch = await bcrypt.compare(password, this.password);

  return isMatch;
};

export const UserModel = mongoose.model<IUser>("User", userSchema);
