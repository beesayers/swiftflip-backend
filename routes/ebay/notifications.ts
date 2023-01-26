import { createHash } from "crypto";
import dotenv from "dotenv";
import express, { Request, Response } from "express";

// get the verification token and endpoint from .env
dotenv.config();
const verificationToken = process.env.EBAY_VERIFICATION_TOKEN ?? "";
const endpoint = process.env.EBAY_ENDPOINT_URL ?? "";

const ebayNotificationRouter = express.Router();

// getting all
ebayNotificationRouter.get("/", (req: Request, res: Response) => {
  const challengeCode = req.query.challenge_code as string;
  const challengeResponse = generateChallengeResponse(challengeCode);

  res
    .status(200)
    .set("Content-Type", "application/json")
    .json({ challengeResponse });
});

// ebay challenge function to verify the endpoint
const generateChallengeResponse = (challengeCode: string): string => {
  const hash = createHash("sha256");
  hash.update(challengeCode);
  hash.update(verificationToken);
  hash.update(endpoint);
  const responseHash = hash.digest("hex");
  const challengeResponse = Buffer.from(responseHash).toString();

  console.log(`challengeResponse: ${challengeResponse}`);
  return challengeResponse;
};

// export default ebayNotificationRouter;
export default ebayNotificationRouter;
