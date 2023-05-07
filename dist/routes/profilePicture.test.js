"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = require("mongoose");
const path_1 = __importDefault(require("path"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const db_1 = __importDefault(require("../config/db"));
const userAccountModel_1 = require("../models/userAccountModel");
const userActivityModel_1 = require("../models/userActivityModel");
const userSessionModel_1 = require("../models/userSessionModel");
async function createUserAccountAndGetToken() {
    const signupResponse = await (0, supertest_1.default)(app_1.default).post("/api/auth/signup").send({
        firstName: "Pho",
        lastName: "Doe",
        email: "john.photo@example.com",
        password: "Password123!",
    });
    return signupResponse;
}
beforeAll(async () => {
    await (0, db_1.default)();
});
afterEach(async () => {
    // Delete user account and should return user object
    const userAccount = await userAccountModel_1.UserAccountModel.findOneAndDelete({ email: "john.photo@example.com" });
    // Delete user sessions
    await userSessionModel_1.UserSessionModel.deleteMany({ userAccount });
    // Delete user activities
    await userActivityModel_1.UserActivityModel.deleteMany({ userAccount });
});
describe("PATCH /api/account/profile-picture", () => {
    it("should update the user's profile picture", async () => {
        // Create a user account and get the token
        const signupResponse = await createUserAccountAndGetToken();
        const token = signupResponse.body.token;
        // Read a test image file (e.g., a small PNG) from the filesystem
        const testImagePath = path_1.default.resolve(__dirname, "test.JPG");
        const testImage = await fs_1.default.promises.readFile(testImagePath);
        // Send the PATCH request to update the profile photo
        const response = await (0, supertest_1.default)(app_1.default)
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
    await (0, mongoose_1.disconnect)();
});
//# sourceMappingURL=profilePicture.test.js.map