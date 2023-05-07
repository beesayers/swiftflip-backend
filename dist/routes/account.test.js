"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const userAccountModel_1 = require("../models/userAccountModel");
const userActivityModel_1 = require("../models/userActivityModel");
const userSessionModel_1 = require("../models/userSessionModel");
async function createUserAccountAndGetToken() {
    const signupResponse = await (0, supertest_1.default)(app_1.default).post("/api/auth/signup").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.button@example.com",
        password: "Password123!",
    });
    return signupResponse;
}
// beforeAll(async () => {
//   await connectDB();
// });
afterEach(async () => {
    // Delete user account and should return user object
    const userAccount = await userAccountModel_1.UserAccountModel.findOneAndDelete({ email: "john.button@example.com" });
    // Delete user sessions
    await userSessionModel_1.UserSessionModel.deleteMany({ userAccount });
    // Delete user activities
    await userActivityModel_1.UserActivityModel.deleteMany({ userAccount });
});
describe("GET /api/account", () => {
    it("+TEST: should get user profile", async () => {
        const signupResponse = await createUserAccountAndGetToken();
        const token = signupResponse.body.token;
        const response = await (0, supertest_1.default)(app_1.default).get("/api/account").set("Authorization", `Bearer ${token}`);
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
        const token = signupResponse.body.token;
        const response = await (0, supertest_1.default)(app_1.default).put("/api/account").set("Authorization", `Bearer ${token}`).send({
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
        const userAccount = await userAccountModel_1.UserAccountModel.findOneAndDelete({ email: "new@example.com" });
        await userSessionModel_1.UserSessionModel.deleteMany({ userAccount });
        await userActivityModel_1.UserActivityModel.deleteMany({ userAccount });
    });
    it("-TEST: should not update user profile if email or password does not follow standards", async () => {
        const signupResponse = await createUserAccountAndGetToken();
        const token = signupResponse.body.token;
        const response = await (0, supertest_1.default)(app_1.default).put("/api/account").set("Authorization", `Bearer ${token}`).send({
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
        const token = signupResponse.body.token;
        const response = await (0, supertest_1.default)(app_1.default).delete("/api/account").set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "User account deleted");
        expect(response.body).toHaveProperty("userAccount");
    });
});
afterAll(async () => {
    // Disconnect Mongoose
    await (0, mongoose_1.disconnect)();
});
//# sourceMappingURL=account.test.js.map