"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEbayNotification = void 0;
const crypto_1 = require("crypto");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const EBAY_VERIFICATION_TOKEN = (_a = process.env.EBAY_VERIFICATION_TOKEN) !== null && _a !== void 0 ? _a : "";
const EBAY_ENDPOINT_URL = (_b = process.env.EBAY_ENDPOINT_URL) !== null && _b !== void 0 ? _b : "";
// @desc    Ebay-required notification endpoint which returns an encrypted response to a challenge code
// @route   GET /api/ebay/notification
// @access  Public
const getEbayNotification = (req, res) => {
    if (req.query.challenge_code === undefined) {
        res.status(403);
        throw new Error("Please provide a challenge_code query");
    }
    const challengeCode = req.query.challenge_code;
    const challengeResponse = generateChallengeResponse(challengeCode);
    res
        .status(200)
        .set("Content-Type", "application/json")
        .json({ challengeResponse });
};
exports.getEbayNotification = getEbayNotification;
// ebay challenge function to verify the endpoint
const generateChallengeResponse = (challengeCode) => {
    const hash = (0, crypto_1.createHash)("sha256");
    hash.update(challengeCode);
    hash.update(EBAY_VERIFICATION_TOKEN);
    hash.update(EBAY_ENDPOINT_URL);
    const responseHash = hash.digest("hex");
    const challengeResponse = Buffer.from(responseHash).toString();
    return challengeResponse;
};
//# sourceMappingURL=ebayNotificationController.js.map