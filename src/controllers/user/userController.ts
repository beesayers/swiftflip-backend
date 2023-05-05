import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IUserSession } from "../../config/types";
import { UserActivityModel } from "../../models/userActivityModel";
import { UserModel } from "../../models/userModel";
import { UserSessionModel } from "../../models/userSessionModel";

export const getUserProfile = asyncHandler(
  async (req: Request & { session?: IUserSession }, res: Response, next: NextFunction): Promise<void> => {
    // Check if the session is present
    if (req.session == null) {
      res.status(401);
      throw new Error("Unauthorized - No session");
    }

    // Return the user data in the response
    res.json(req.session.user);
  }
);

export const updateUserProfile = asyncHandler(
  async (req: Request & { session?: IUserSession }, res: Response, next: NextFunction): Promise<void> => {
    // Check if the session is present
    if (req.session == null) {
      res.status(401);
      throw new Error("Unauthorized - No session");
    }

    // Update the user data
    req.session.user.firstName = req.body.firstName ?? req.session.user.firstName;
    req.session.user.lastName = req.body.lastName ?? req.session.user.lastName;
    req.session.user.email = req.body.email ?? req.session.user.email;
    req.body.password != null && (req.session.user.password = req.body.password);

    try {
      // save the updated user data, and return the record without the password
      const updatedUser = await req.session.user.save();
      res.json({
        message: "User profile updated successfully",
        user: {
          _id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
          __v: updatedUser.__v,
        },
      });
    } catch (error: any) {
      res.status(400);
      throw new Error("Invalid email or password");
    }
  }
);

export const deleteUserProfile = asyncHandler(
  async (req: Request & { session?: IUserSession }, res: Response, next: NextFunction): Promise<void> => {
    // Check if the session is present
    if (req.session == null) {
      res.status(401);
      throw new Error("Unauthorized - No session");
    }

    // Delete user sessions
    await UserSessionModel.deleteMany({ user: req.session.user._id });
    // Delete user activity records
    await UserActivityModel.deleteMany({ user: req.session.user._id });
    // Delete the user account
    const deletedUser = await UserModel.findByIdAndDelete(req.session.user._id);
    if (deletedUser != null) {
      res.json({ message: "Profile deleted", user: deletedUser });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
);
