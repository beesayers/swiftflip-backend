import express from "express";
import {
  addStatistics,
  cleanEbaySearchResults,
  postEbaySearch,
  saveSearchResults,
} from "../controllers/ebay/ebaySearchController";
import { saveSearch } from "../controllers/search/searchController";

export const searchRouter = express.Router();

// POST /api/search
searchRouter.route("/").post(saveSearch, postEbaySearch, cleanEbaySearchResults, addStatistics, saveSearchResults);
