import express from "express";
import {
  addStatistics,
  cleanEbaySearchResults,
  postEbaySearch,
  saveSearch,
  saveSearchResults,
} from "../controllers/search/searchController";
import { requireAuth } from "../middleware/authMiddleware";

export const searchRouter = express.Router();

// POST /api/search
searchRouter
  .route("/")
  .post(requireAuth, saveSearch, postEbaySearch, cleanEbaySearchResults, addStatistics, saveSearchResults);
