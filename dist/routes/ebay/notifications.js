"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
// get the verification token and endpoint from .env
dotenv_1.default.config();
const verificationToken = (_a = process.env.EBAY_VERIFICATION_TOKEN) !== null && _a !== void 0 ? _a : "";
const endpoint = (_b = process.env.EBAY_ENDPOINT) !== null && _b !== void 0 ? _b : "";
const ebayNotificationRouter = express_1.default.Router();
// getting all
ebayNotificationRouter.get("/", (req, res) => {
    const challengeCode = req.query.challenge_code;
    const challengeResponse = generateChallengeResponse(challengeCode);
    res
        .status(200)
        .set("Content-Type", "application/json")
        .json({ challengeResponse });
});
// ebay challenge function to verify the endpoint
const generateChallengeResponse = (challengeCode) => {
    const hash = (0, crypto_1.createHash)("sha256");
    hash.update(challengeCode);
    hash.update(verificationToken);
    hash.update(endpoint);
    const responseHash = hash.digest("hex");
    const challengeResponse = Buffer.from(responseHash).toString();
    console.log(`challengeResponse: ${challengeResponse}`);
    return challengeResponse;
};
// export default ebayNotificationRouter;
exports.default = ebayNotificationRouter;
//# sourceMappingURL=notifications.js.map