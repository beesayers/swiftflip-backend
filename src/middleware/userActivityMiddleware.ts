import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IUserSession } from "../config/types";
import { UserActivityModel } from "../models/userActivityModel";

export const logUserActivity = asyncHandler(
  async (req: Request & { session?: IUserSession }, res: Response, next: NextFunction) => {
    // log signin and signout
    if ((req.path === "/signin" || req.path === "/signout" || req.path === "/signup") && req.session != null) {
      await UserActivityModel.create({
        user: req.session.user,
        activityType: `${req.method} ${req.path}`,
        activityDetails: req.path.slice(1, req.path.length),
        createdAt: new Date(),
      });
    }

    // Log user activity
    if (req.path === "/profile" && req.session != null) {
      const details =
        req.method === "GET" ? "Viewed profile" : req.method === "PUT" ? "Updated profile" : "Deleted profile";
      await UserActivityModel.create({
        user: req.session.user,
        activityType: `${req.method} ${req.path}`,
        activityDetails: details,
        createdAt: new Date(),
      });
    }
  }
);
