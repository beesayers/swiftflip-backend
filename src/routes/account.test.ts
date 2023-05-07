import { disconnect } from "mongoose";
import request from "supertest";
import app from "../app";
import connectDB from "../config/db";
import { UserAccountModel } from "../models/userAccountModel";
import { UserActivityModel } from "../models/userActivityModel";
import { UserSessionModel } from "../models/userSessionModel";

async function createUserAccountAndGetToken(): Promise<any> {
  const signupResponse = await request(app).post("/api/auth/signup").send({
    firstName: "John",
    lastName: "Doe",
    email: "john.button@example.com",
    password: "Password123!",
  });

  return signupResponse;
}

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  // Delete user account and should return user object
  const userAccount = await UserAccountModel.findOneAndDelete({ email: "john.button@example.com" });

  // Delete user sessions
  await UserSessionModel.deleteMany({ userAccount });

  // Delete user activities
  await UserActivityModel.deleteMany({ userAccount });
});

describe("GET /api/account", () => {
  it("+TEST: should get user profile", async () => {
    const signupResponse = await createUserAccountAndGetToken();
    const token = signupResponse.body.token as string;
    const response = await request(app).get("/api/account").set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("firstName");
    expect(response.body).toHaveProperty("lastName");
    expect(response.body).toHaveProperty("email");
  });
});

describe("PUT /api/account", () => {
  it("+TEST: should update user profile", async () => {
    const signupResponse = await createUserAccountAndGetToken();
    const token = signupResponse.body.token as string;
    const response = await request(app).put("/api/account").set("Authorization", `Bearer ${token}`).send({
      firstName: "new",
      lastName: "new",
      email: "new@example.com",
      password: "newPassword123!",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("userAccount");
    expect(response.body.userAccount.firstName).toBe("new");
    expect(response.body.userAccount.lastName).toBe("new");
    expect(response.body.userAccount.email).toBe("new@example.com");
    expect(response.body.userAccount).not.toHaveProperty("password");

    // Delete the changed user account and all associated sessions and activities
    //    otherwise, this stays
    const userAccount = await UserAccountModel.findOneAndDelete({ email: "new@example.com" });
    await UserSessionModel.deleteMany({ userAccount });
    await UserActivityModel.deleteMany({ userAccount });
  });

  it("-TEST: should not update user profile if email or password does not follow standards", async () => {
    const signupResponse = await createUserAccountAndGetToken();
    const token = signupResponse.body.token as string;
    const response = await request(app).put("/api/account").set("Authorization", `Bearer ${token}`).send({
      firstName: "new",
      lastName: "new",
      email: "new@example.com",
      password: "new",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid email or password");
  });
});

describe("DELETE /api/account", () => {
  it("should delete user profile", async () => {
    const signupResponse = await createUserAccountAndGetToken();
    const token = signupResponse.body.token as string;
    const response = await request(app).delete("/api/account").set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "User account deleted");
    expect(response.body).toHaveProperty("userAccount");
  });
});

afterAll(async () => {
  // Disconnect Mongoose
  await disconnect();
});
