import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IUserAccount, IUserSession } from "../../config/types";
import { UserAccountModel } from "../../models/userAccountModel";
import { UserSessionModel } from "../../models/userSessionModel";

export const signup = asyncHandler(
  async (req: Request & { session?: IUserSession }, res: Response, next: NextFunction): Promise<void> => {
    const { firstName, lastName, email, password } = req.body;

    // Verify that the all fields are present
    if (firstName.length === 0 || lastName.length === 0 || email.length === 0 || password.length === 0) {
      res.status(400);
      throw new Error("All fields are required");
    }

    // Check if the email is already in use
    const existingUserAccount = await UserAccountModel.findOne({ email });
    if (existingUserAccount != null) {
      res.status(400);
      throw new Error("User account already exists");
    }

    // Create a new user account
    const userAccount = new UserAccountModel({
      firstName,
      lastName,
      email,
      password,
    });

    // catch errors for duplicate emails and invalid emails and invalid passwords
    try {
      await userAccount.save();
    } catch (error: any) {
      res.status(400);
      throw new Error(error.message);
    }

    // Create a new user session
    const session = await (await userAccount.createSession()).populate("userAccount", "-password");

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

export const signin = asyncHandler(
  async (req: Request & { session?: IUserSession }, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    // Verify that the email and password fields are present
    if (email.length === 0 && password.length === 0) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Find the user account by email
    const userAccount: IUserAccount | null = await UserAccountModel.findOne({ email });

    if (userAccount == null) {
      res.status(404);
      throw new Error("User account not found");
    }

    // Verify the password using bcrypt
    const isMatch = await userAccount.comparePassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error("Incorrect email or password");
    }

    // Create a new user session
    const session = await (await userAccount?.createSession()).populate("userAccount", "-password");

    // Return the session token and user account data in the response
    res.json(session);

    // Pass on to logging middleware
    req.session = session;
    next();
  }
);

export const signout = asyncHandler(
  async (req: Request & { session?: IUserSession }, res: Response, next: NextFunction): Promise<void> => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // Verify that the token is present
    if (token == null) {
      res.status(401);
      throw new Error("Unauthorized - No token");
    }

    // Find the session by token, and populate the user data
    const session = await UserSessionModel.findOne({ token }).populate("userAccount", "-password");

    if (session == null) {
      res.status(404);
      throw new Error("Session not found");
    }

    // Revoke the session
    if (session.userAccount != null) {
      await session.userAccount.revokeSession(token);
      res.json({ message: "Logout successful. Token: " + token });
    }

    // Pass on to logging middleware
    req.session = session;
    next();
  }
);

export const checkAuthStatus = asyncHandler(
  async (req: Request & { session?: IUserSession }, res: Response, next: NextFunction): Promise<void> => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // Verify that the token is present
    if (token == null) {
      res.status(401);
      throw new Error("Unauthorized - No token");
    }

    // Find the session by token, and populate the user data
    const session = await UserSessionModel.findOne({ token }).populate("userAccount", "-password");

    if (session == null) {
      res.status(404);
      throw new Error("Session not found");
    }

    // Return logged in status and session data
    res.json({ isLoggedIn: true, session });

    // Pass on to logging middleware
    req.session = session;
    next();
  }
);
