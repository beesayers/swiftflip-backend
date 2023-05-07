import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IUserSession } from "../config/types";
import { UserSessionModel } from "../models/userSessionModel";

export const requireAuth = asyncHandler(
  async (req: Request & { session?: IUserSession }, res: Response, next: NextFunction): Promise<void> => {
    // Get the token from the header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // Check if the token is present
    if (token == null) {
      res.status(401);
      throw new Error("Unauthorized - No token");
    }

    // Find the session
    const session: IUserSession | null = await UserSessionModel.findOne({ token }).populate("userAccount", "-password");
    if (session == null) {
      res.status(401);
      throw new Error("Unauthorized - No session");
    }

    // Check if the token is valid
    const validToken = await session?.isValidToken(token);
    if (!validToken) {
      res.status(401);
      throw new Error("Unauthorized - Invalid token");
    }

    req.session = session;
    next();
  }
);
