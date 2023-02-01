import { createHash } from "crypto";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();
const EBAY_VERIFICATION_TOKEN = process.env.EBAY_VERIFICATION_TOKEN ?? "";
const EBAY_ENDPOINT_URL = process.env.EBAY_ENDPOINT_URL ?? "";

// @desc    Ebay-required notification endpoint which returns an encrypted response to a challenge code
// @route   GET /api/ebay/notification
// @access  Public
const getEbayNotification = (req: Request, res: Response): void => {
  if (req.query.challenge_code === undefined) {
    res.status(403);
    throw new Error("Please provide a challenge_code query");
  }
  const challengeCode = req.query.challenge_code as string;
  const challengeResponse = generateChallengeResponse(challengeCode);

  res
    .status(200)
    .set("Content-Type", "application/json")
    .json({ challengeResponse });
};

// ebay challenge function to verify the endpoint
const generateChallengeResponse = (challengeCode: string): string => {
  const hash = createHash("sha256");
  hash.update(challengeCode);
  hash.update(EBAY_VERIFICATION_TOKEN);
  hash.update(EBAY_ENDPOINT_URL);
  const responseHash = hash.digest("hex");
  const challengeResponse = Buffer.from(responseHash).toString();
  return challengeResponse;
};

export { getEbayNotification };
