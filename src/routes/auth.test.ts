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
    email: "john.doe@example.com",
    password: "Password123!",
  });

  return signupResponse;
}

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  // Delete user account and should return user object
  const userAccount = await UserAccountModel.findOneAndDelete({ email: "john.doe@example.com" });

  // Delete user sessions
  await UserSessionModel.deleteMany({ userAccount });

  // Delete user activities
  await UserActivityModel.deleteMany({ userAccount });
});

describe("POST /api/auth/signup", () => {
  it("+TEST: should sign up a new userAccount", async () => {
    const response = await createUserAccountAndGetToken();

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("userAccount");
  });

  it("-TEST: should not sign up a new user with an existing email", async () => {
    const firstSignupResponse = await createUserAccountAndGetToken();
    const secondSignupResponse = await createUserAccountAndGetToken();

    expect(secondSignupResponse.statusCode).toBe(400);
    expect(secondSignupResponse.body).toHaveProperty("message", "User account already exists");
  });

  it("-TEST: should not sign up a new user with an invalid email", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      firstName: "InvalidEmail",
      lastName: "SignupTest",
      email: "invalidemail",
      password: "Password123!",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toContain("UserAccount validation failed: email");
  });

  it("-TEST: should not sign up a new user with an invalid password", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      firstName: "InvalidPassword",
      lastName: "SignupTest",
      email: "invalidpasswordsignuptest@mail.com",
      password: "passwor",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toContain("UserAccount validation failed: password");
  });
});

describe("POST /api/auth/signin ", () => {
  it("+TEST: should sign in an existing user and create a user session", async () => {
    const signupResponse = await createUserAccountAndGetToken();
    const response = await request(app).post("/api/auth/signin").send({
      email: "john.doe@example.com",
      password: "Password123!",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("userAccount");
  });

  it("-TEST: should not sign in a user with an incorrect password", async () => {
    const signupResponse = await createUserAccountAndGetToken();
    const response = await request(app).post("/api/auth/signin").send({
      email: "john.doe@example.com",
      password: "Password123",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("message", "Incorrect email or password");
  });

  it("-TEST: should not sign in a user with an incorrect email", async () => {
    const signupResponse = await createUserAccountAndGetToken();
    const response = await request(app).post("/api/auth/signin").send({
      email: "john@example.com",
      password: "Password123!",
    });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("message", "User account not found");
  });
});

describe("POST /api/auth/signout", () => {
  it("+TEST: should sign out a user", async () => {
    const signupResponse = await createUserAccountAndGetToken();
    const token = signupResponse.body.token as string;
    const response = await request(app).post("/api/auth/signout").set("Authorization", `Bearer ${token}`);
    const session = await UserSessionModel.findOne({ token });

    expect(response.statusCode).toBe(200);
    expect(session).toBeNull();
    expect(response.body).toHaveProperty("message", "Logout successful. Token: " + token);
  });
});

afterAll(async () => {
  // Disconnect Mongoose
  await disconnect();
});
