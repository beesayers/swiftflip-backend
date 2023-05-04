import mongoose, { Schema } from "mongoose";
import { IUserActivity } from "../config/types";

const userActivitySchema = new Schema<IUserActivity>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  // Activity type: "signup", "login", "logout", "search"
  activityType: { type: String, required: true },
  // Activity details: "user signed up", "user logged in", "user logged out", "user searched for ..."
  activityDetails: { type: String, required: true },
  // Activity date
  createdAt: { type: Date, required: true },
});

export const UserActivityModel = mongoose.model<IUserActivity>("UserActivity", userActivitySchema);
