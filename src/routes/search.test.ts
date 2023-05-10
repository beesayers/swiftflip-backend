import { disconnect } from "mongoose";
import request from "supertest";
import app from "../app";
import connectDB from "../config/db";
import { IUserAccount } from "../config/types";
import { SearchModel } from "../models/searchModel";
import { UserAccountModel } from "../models/userAccountModel";
import { UserSessionModel } from "../models/userSessionModel";

beforeAll(async () => {
  await connectDB();
});

let testUserAccount: IUserAccount;
let testToken: string;

describe("POST /api/search", () => {
  beforeAll(async () => {
    // Create a test user
    testUserAccount = await UserAccountModel.create({
      firstName: "search",
      lastName: "test",
      email: "searchtest@email.com",
      password: "Password123!",
    });

    // Create a test session
    const testSession = await testUserAccount.createSession();

    testToken = testSession.token;
  });

  it("should respond with 401 if no token is provided", async () => {
    const res = await request(app).post("/api/search");
    expect(res.statusCode).toEqual(401);
  });

  it("should respond with 400 if required fields are not provided", async () => {
    const res = await request(app)
      .post("/api/search")
      .set("Authorization", `Bearer ${testToken}`)
      .send({ keywords: "test" });

    expect(res.statusCode).toEqual(400);
  });

  it("should respond with 200 and the search document if everything is correct", async () => {
    const res = await request(app)
      .post("/api/search")
      .set("Authorization", `Bearer ${testToken}`)
      .send({ keywords: "test", condition: "1000", sortOrder: "BestMatch" });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("keywords", "test");
  });

  afterAll(async () => {
    // Delete the test user and its associated data
    await SearchModel.deleteMany({ userAccount: testUserAccount._id });
    await UserSessionModel.deleteMany({ userAccount: testUserAccount._id });
    await UserAccountModel.deleteOne({ _id: testUserAccount._id });
  });
});

afterAll(async () => {
  // Disconnect Mongoose
  await disconnect();
});
