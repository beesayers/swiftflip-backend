"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const db_1 = __importDefault(require("../config/db"));
const searchModel_1 = require("../models/searchModel");
const userAccountModel_1 = require("../models/userAccountModel");
const userSessionModel_1 = require("../models/userSessionModel");
beforeAll(async () => {
    await (0, db_1.default)();
});
let testUserAccount;
let testToken;
describe("POST /api/search", () => {
    beforeAll(async () => {
        // Create a test user
        testUserAccount = await userAccountModel_1.UserAccountModel.create({
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
        const res = await (0, supertest_1.default)(app_1.default).post("/api/search");
        expect(res.statusCode).toEqual(401);
    });
    it("should respond with 400 if required fields are not provided", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/search")
            .set("Authorization", `Bearer ${testToken}`)
            .send({ keywords: "test" });
        expect(res.statusCode).toEqual(400);
    });
    it("should respond with 200 and the search document if everything is correct", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/search")
            .set("Authorization", `Bearer ${testToken}`)
            .send({ keywords: "test", condition: "1000", sortOrder: "BestMatch" });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("keywords", "test");
    });
    afterAll(async () => {
        // Delete the test user and its associated data
        await searchModel_1.SearchModel.deleteMany({ userAccount: testUserAccount._id });
        await userSessionModel_1.UserSessionModel.deleteMany({ userAccount: testUserAccount._id });
        await userAccountModel_1.UserAccountModel.deleteOne({ _id: testUserAccount._id });
    });
});
afterAll(async () => {
    // Disconnect Mongoose
    await (0, mongoose_1.disconnect)();
});
//# sourceMappingURL=search.test.js.map