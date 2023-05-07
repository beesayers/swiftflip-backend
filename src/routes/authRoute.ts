import express from "express";
import { checkAuthStatus, signin, signout, signup } from "../controllers/auth/authController";
import { logUserActivity } from "../middleware/userActivityMiddleware";

export const authRouter = express.Router();

authRouter.post("/signin", signin, logUserActivity);
authRouter.post("/signout", signout, logUserActivity);
authRouter.post("/signup", signup, logUserActivity);
authRouter.get("/status", checkAuthStatus, logUserActivity);
