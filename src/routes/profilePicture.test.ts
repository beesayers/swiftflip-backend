import fs from "fs";
import { disconnect } from "mongoose";
import path from "path";
import request from "supertest";
import app from "../app";
import connectDB from "../config/db";

import { UserAccountModel } from "../models/userAccountModel";
import { UserActivityModel } from "../models/userActivityModel";
import { UserSessionModel } from "../models/userSessionModel";

async function createUserAccountAndGetToken(): Promise<any> {
  const signupResponse = await request(app).post("/api/auth/signup").send({
    firstName: "Pho",
    lastName: "Doe",
    email: "john.photo@example.com",
    password: "Password123!",
  });

  return signupResponse;
}

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  // Delete user account and should return user object
  const userAccount = await UserAccountModel.findOneAndDelete({ email: "john.photo@example.com" });

  // Delete user sessions
  await UserSessionModel.deleteMany({ userAccount });

  // Delete user activities
  await UserActivityModel.deleteMany({ userAccount });
});

describe("PATCH /api/account/profile-picture", () => {
  it("should update the user's profile picture", async () => {
    // Create a user account and get the token
    const signupResponse = await createUserAccountAndGetToken();
    const token = signupResponse.body.token as string;

    // Read a test image file (e.g., a small PNG) from the filesystem
    const testImagePath = path.resolve(__dirname, "test.JPG");
    const testImage = await fs.promises.readFile(testImagePath);

    // Send the PATCH request to update the profile photo
    const response = await request(app)
      .patch("/api/account/profile-picture")
      .set("Authorization", `Bearer ${token}`)
      .attach("photo", testImage, "image.png");

    // Check if the response has the expected status and properties
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Profile picture updated");
    expect(response.body).toHaveProperty("userAccount");
    expect(response.body.userAccount).toHaveProperty("profilePicture");
    expect(response.body.userAccount.profilePicture).toHaveProperty("url");
  }, 20000);

  // Add more tests for other scenarios (e.g., no token provided, invalid image, etc.)
});

afterAll(async () => {
  // Disconnect Mongoose
  await disconnect();
});
