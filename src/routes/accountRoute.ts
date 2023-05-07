import express from "express";
import multer from "multer";
import {
  deleteUserAccount,
  getUserAccount,
  updateProfilePicture,
  updateUserAccount,
} from "../controllers/account/accountController";
import { requireAuth } from "../middleware/authMiddleware";
import { logUserActivity } from "../middleware/userActivityMiddleware";

export const accountRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

accountRouter.get("/", requireAuth, logUserActivity, getUserAccount);
accountRouter.put("/", requireAuth, logUserActivity, updateUserAccount);
accountRouter.delete("/", requireAuth, logUserActivity, deleteUserAccount);
accountRouter.patch("/profile-picture", requireAuth, upload.single("photo"), updateProfilePicture);
