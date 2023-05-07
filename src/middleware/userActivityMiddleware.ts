import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IUserSession } from "../config/types";

export const logUserActivity = asyncHandler(
  async (req: Request & { session?: IUserSession }, res: Response, next: NextFunction) => {
    // log signin, signout, signup, and status activity
    if (
      (req.path === "/signin" || req.path === "/signout" || req.path === "/signup" || req.path === "/status") &&
      req.session != null
    ) {
      const userActivity = await req.session.userAccount.createActivity(
        `${req.method} ${req.path}`,
        req.path.slice(1, req.path.length)
      );
    }

    // Log account activity
    if (req.path === "/account" && req.session != null) {
      const details =
        req.method === "GET" ? "Viewed profile" : req.method === "PUT" ? "Updated profile" : "Deleted profile";
      const userActivity = await req.session.userAccount.createActivity(`${req.method} ${req.path}`, details);
    }

    next();
  }
);
