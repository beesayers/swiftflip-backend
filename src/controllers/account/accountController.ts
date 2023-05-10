import { UploadApiResponse } from "cloudinary";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Readable } from "stream";
import config from "../../config/config";
import { IUserSession } from "../../config/types";
import { UserAccountModel } from "../../models/userAccountModel";
import { UserActivityModel } from "../../models/userActivityModel";
import { UserSessionModel } from "../../models/userSessionModel";

export const getUserAccount = asyncHandler(
  async (req: Request & { session?: IUserSession }, res: Response, next: NextFunction): Promise<void> => {
    // Check if the session is present
    if (req.session == null) {
      res.status(401);
      throw new Error("Unauthorized - No session");
    }

    // Return the user data in the response
    res.json(req.session.userAccount);
  }
);

export const updateUserAccount = asyncHandler(
  async (req: Request & { session?: IUserSession }, res: Response, next: NextFunction): Promise<void> => {
    // Check if the session is present
    if (req.session == null) {
      res.status(401);
      throw new Error("Unauthorized - No session");
    }

    // Update the user data
    req.session.userAccount.firstName = req.body.firstName ?? req.session.userAccount.firstName;
    req.session.userAccount.lastName = req.body.lastName ?? req.session.userAccount.lastName;
    req.session.userAccount.email = req.body.email ?? req.session.userAccount.email;
    req.body.password != null && (req.session.userAccount.password = req.body.password);

    try {
      // save the updated user data, and return the record without the password
      const updatedUserAccount = await req.session.userAccount.save();
      res.json({
        message: "User account updated successfully",
        userAccount: {
          _id: updatedUserAccount._id,
          firstName: updatedUserAccount.firstName,
          lastName: updatedUserAccount.lastName,
          email: updatedUserAccount.email,
          createdAt: updatedUserAccount.createdAt,
          updatedAt: updatedUserAccount.updatedAt,
          __v: updatedUserAccount.__v,
        },
      });
    } catch (error: any) {
      res.status(400);
      throw new Error("Invalid email or password");
    }
  }
);

export const deleteUserAccount = asyncHandler(
  async (req: Request & { session?: IUserSession }, res: Response, next: NextFunction): Promise<void> => {
    // Check if the session is present
    if (req.session == null) {
      res.status(401);
      throw new Error("Unauthorized - No session");
    }

    // Delete user sessions
    await UserSessionModel.deleteMany({ user: req.session.userAccount._id });
    // Delete user activity records
    await UserActivityModel.deleteMany({ user: req.session.userAccount._id });
    // Delete the user account
    const deletedUserAccount = await UserAccountModel.findByIdAndDelete(req.session.userAccount._id);
    if (deletedUserAccount != null) {
      res.json({ message: "User account deleted", userAccount: deletedUserAccount });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
);

export const updateProfilePicture = asyncHandler(
  async (req: Request & { session?: IUserSession }, res: Response, next: NextFunction): Promise<void> => {
    // Check if the session is present
    if (req.session == null) {
      res.status(401);
      throw new Error("Unauthorized - No session");
    }
    const userAccountId = req.session.userAccount._id;

    // Check if the file is provided in the request
    if (req.file == null) {
      res.status(400);
      throw new Error("No file provided");
    }

    try {
      // Create a readable stream from the uploaded image buffer
      const readableStream = new Readable();
      readableStream.push(req.file.buffer);
      readableStream.push(null);

      // Upload the image to Cloudinary
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadStream = config.cloudinary.uploader.upload_stream(
          {
            folder: "profile_pictures/",
            public_id: userAccountId.toString(),
            transformation: [{ width: 150, height: 150, crop: "fill" }],
          },
          (error: any, result) => {
            if (result != null) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        readableStream.pipe(uploadStream);
      });

      // Update the user's profile photo URL in the database
      const userAccount = await UserAccountModel.findByIdAndUpdate(
        userAccountId,
        { profilePicture: { url: result.url } },
        { new: true }
      );

      if (userAccount == null) {
        res.status(404);
        throw new Error("User account not found");
      }

      res.status(200).json({ message: "Profile picture updated", userAccount });
    } catch (error) {
      console.error(error);
      res.status(500);
      next(error);
    }
  }
);
