import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IUserSession } from "../../config/types";
import { UserSessionModel } from "../../models/userSessionModel";

export const signout = asyncHandler(
  async (req: Request & { session?: IUserSession }, res: Response, next: NextFunction): Promise<void> => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // Verify that the token is present
    if (token == null) {
      res.status(401);
      throw new Error("Unauthorized - No token");
    }

    // Find the session by token, and populate the user data
    const session = await UserSessionModel.findOne({ token }).populate("user", "-password");

    if (session == null) {
      res.status(404);
      throw new Error("Session not found");
    }

    // Revoke the session
    if (session.user != null) {
      await session.user.revokeSession(token);
      res.json({ message: "Logout successful. Token: " + token });
    }

    // Pass on to logging middleware
    req.session = session;
    next();
  }
);
