import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IUserSession } from "../../config/types";
import { UserModel } from "../../models/userModel";

export const signup = asyncHandler(
  async (req: Request & { session?: IUserSession }, res: Response, next: NextFunction): Promise<void> => {
    const { firstName, lastName, email, password } = req.body;

    // Verify that the all fields are present
    if (firstName.length === 0 || lastName.length === 0 || email.length === 0 || password.length === 0) {
      res.status(400);
      throw new Error("All fields are required");
    }

    // Check if the email is already in use
    const existingUser = await UserModel.findOne({ email });
    if (existingUser != null) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Create a new user
    const user = new UserModel({
      firstName,
      lastName,
      email,
      password,
    });

    // catch errors for duplicate emails and invalid emails and invalid passwords
    try {
      await user.save();
    } catch (error: any) {
      res.status(400);
      throw new Error(error.message);
    }

    // Create a new user session
    const session = await (await user.createSession()).populate("user", "-password");

    if (session == null) {
      res.status(500);
      throw new Error("Session creation failed");
    }

    // Return the session token and user data in the response
    res.json(session);

    // Pass on to logging middleware
    req.session = session;
    next();
  }
);
