import express from "express";
import { postEbaySearch, saveSearchResults } from "../../controllers/ebay/ebaySearchController";
import { saveSearch } from "../../controllers/search/searchController";
const searchRouter = express.Router();

// POST /api/search
searchRouter.route("/").post(saveSearch, postEbaySearch, saveSearchResults);

export { searchRouter };
