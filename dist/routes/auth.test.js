"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const db_1 = __importDefault(require("../config/db"));
const userActivityModel_1 = require("../models/userActivityModel");
const userModel_1 = require("../models/userModel");
const userSessionModel_1 = require("../models/userSessionModel");
async function createUserAndGetToken() {
    const signupResponse = await (0, supertest_1.default)(app_1.default).post("/api/auth/signup").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "Password123!",
    });
    return signupResponse;
}
beforeAll(async () => {
    await (0, db_1.default)();
});
describe("POST /api/auth/signup", () => {
    it("+TEST: should sign up a new user", async () => {
        const response = await createUserAndGetToken();
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("user");
    });
    it("-TEST: should not sign up a new user with an existing email", async () => {
        const firstSignupResponse = await createUserAndGetToken();
        const secondSignupResponse = await createUserAndGetToken();
        expect(secondSignupResponse.statusCode).toBe(400);
        expect(secondSignupResponse.body).toHaveProperty("message", "User already exists");
    });
    it("-TEST: should not sign up a new user with an invalid email", async () => {
        const response = await (0, supertest_1.default)(app_1.default).post("/api/auth/signup").send({
            firstName: "InvalidEmail",
            lastName: "SignupTest",
            email: "invalidemail",
            password: "Password123!",
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message", "User validation failed: email: Please enter a valid email address");
    });
    it("-TEST: should not sign up a new user with an invalid password", async () => {
        const response = await (0, supertest_1.default)(app_1.default).post("/api/auth/signup").send({
            firstName: "InvalidPassword",
            lastName: "SignupTest",
            email: "invalidpasswordsignuptest@mail.com",
            password: "passwor",
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message", "User validation failed: password: Password must be at least 8 characters long and contain at least one number and one special character");
    });
});
describe("POST /api/auth/signin ", () => {
    it("+TEST: should sign in an existing user and create a user session", async () => {
        const signupResponse = await createUserAndGetToken();
        const response = await (0, supertest_1.default)(app_1.default).post("/api/auth/signin").send({
            email: "john.doe@example.com",
            password: "Password123!",
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("user");
    });
    it("-TEST: should not sign in a user with an incorrect password", async () => {
        const signupResponse = await createUserAndGetToken();
        const response = await (0, supertest_1.default)(app_1.default).post("/api/auth/signin").send({
            email: "john.doe@example.com",
            password: "Password123",
        });
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty("message", "Incorrect email or password");
    });
    it("-TEST: should not sign in a user with an incorrect email", async () => {
        const signupResponse = await createUserAndGetToken();
        const response = await (0, supertest_1.default)(app_1.default).post("/api/auth/signin").send({
            email: "john@example.com",
            password: "Password123!",
        });
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("message", "User not found");
    });
});
describe("POST /api/auth/signout", () => {
    it("+TEST: should sign out a user", async () => {
        const signupResponse = await createUserAndGetToken();
        const token = signupResponse.body.token;
        const response = await (0, supertest_1.default)(app_1.default).post("/api/auth/signout").set("Authorization", `Bearer ${token}`);
        const session = await userSessionModel_1.UserSessionModel.findOne({ token });
        expect(response.statusCode).toBe(200);
        expect(session).toBeNull();
        expect(response.body).toHaveProperty("message", "Logout successful. Token: " + token);
    });
});
describe("GET /api/auth/profile", () => {
    it("+TEST: should get user profile", async () => {
        const signupResponse = await createUserAndGetToken();
        const token = signupResponse.body.token;
        const response = await (0, supertest_1.default)(app_1.default).get("/api/auth/profile").set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("_id");
        expect(response.body).toHaveProperty("firstName");
        expect(response.body).toHaveProperty("lastName");
        expect(response.body).toHaveProperty("email");
    });
});
describe("PUT /api/auth/profile", () => {
    it("+TEST: should update user profile", async () => {
        const signupResponse = await createUserAndGetToken();
        const token = signupResponse.body.token;
        const response = await (0, supertest_1.default)(app_1.default).put("/api/auth/profile").set("Authorization", `Bearer ${token}`).send({
            firstName: "new",
            lastName: "new",
            email: "new@example.com",
            password: "newPassword123!",
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("user");
        expect(response.body.user.firstName).toBe("new");
        expect(response.body.user.lastName).toBe("new");
        expect(response.body.user.email).toBe("new@example.com");
        expect(response.body.user).not.toHaveProperty("password");
        // Delete the changed user and all associated sessions and activities
        //    otherwise, this stays
        const user = await userModel_1.UserModel.findOneAndDelete({ email: "new@example.com" });
        await userSessionModel_1.UserSessionModel.deleteMany({ user });
        await userActivityModel_1.UserActivityModel.deleteMany({ user });
    });
    it("-TEST: should not update user profile if email or password does not follow standards", async () => {
        const signupResponse = await createUserAndGetToken();
        const token = signupResponse.body.token;
        const response = await (0, supertest_1.default)(app_1.default).put("/api/auth/profile").set("Authorization", `Bearer ${token}`).send({
            firstName: "new",
            lastName: "new",
            email: "new@example.com",
            password: "new",
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message", "Invalid email or password");
    });
});
describe("DELETE /api/auth/profile", () => {
    it("should delete user profile", async () => {
        const signupResponse = await createUserAndGetToken();
        const token = signupResponse.body.token;
        const response = await (0, supertest_1.default)(app_1.default).delete("/api/auth/profile").set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "Profile deleted");
        expect(response.body).toHaveProperty("user");
    });
});
afterEach(async () => {
    // Delete user account and should return user object
    const user = await userModel_1.UserModel.findOneAndDelete({ email: "john.doe@example.com" });
    // Delete user sessions
    await userSessionModel_1.UserSessionModel.deleteMany({ user });
    // Delete user activities
    await userActivityModel_1.UserActivityModel.deleteMany({ user });
});
afterAll(async () => {
    // Disconnect Mongoose
    await (0, mongoose_1.disconnect)();
});
//# sourceMappingURL=auth.test.js.map