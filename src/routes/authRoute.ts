import express from "express";
import { signin } from "../controllers/auth/signinController";
import { signout } from "../controllers/auth/signoutController";
import { signup } from "../controllers/auth/signupController";
import { deleteUserProfile, getUserProfile, updateUserProfile } from "../controllers/user/userController";
import { requireAuth } from "../middleware/authMiddleware";
import { logUserActivity } from "../middleware/userActivityMiddleware";

export const authRouter = express.Router();

authRouter.post("/signin", signin, logUserActivity);
authRouter.post("/signout", signout, logUserActivity);
authRouter.post("/signup", signup, logUserActivity);
authRouter.get("/profile", requireAuth, logUserActivity, getUserProfile);
authRouter.put("/profile", requireAuth, logUserActivity, updateUserProfile);
authRouter.delete("/profile", requireAuth, logUserActivity, deleteUserProfile);
