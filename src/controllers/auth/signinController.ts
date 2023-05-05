import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IUser, IUserSession } from "../../config/types";
import { UserModel } from "../../models/userModel";

export const signin = asyncHandler(
  async (req: Request & { session?: IUserSession }, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    // Verify that the email and password fields are present
    if (email.length === 0 && password.length === 0) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Find the user by email
    const user: IUser | null = await UserModel.findOne({ email });

    if (user == null) {
      res.status(404);
      throw new Error("User not found");
    }

    // Verify the password using bcrypt
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error("Incorrect email or password");
    }

    // Create a new user session
    const session = await (await user?.createSession()).populate("user", "-password");

    // Return the session token and user data in the response
    res.json(session);

    // Pass on to logging middleware
    req.session = session;
    next();
  }
);
