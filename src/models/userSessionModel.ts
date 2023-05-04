import mongoose, { Schema } from "mongoose";
import { IUserSession } from "../config/types";

const userSessionSchema = new Schema<IUserSession>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, unique: true, required: true },
  expiresAt: { type: Date, required: true },
});

userSessionSchema.methods.isValidToken = async function (token: string) {
  const session = await UserSessionModel.findOne({ token }).populate("user", "-password");

  if (session === null || session.user._id === null) {
    return false;
  }

  if (session.expiresAt < new Date()) {
    await session.remove();
    return false;
  }

  return true;
};

export const UserSessionModel = mongoose.model<IUserSession>("UserSession", userSessionSchema);
