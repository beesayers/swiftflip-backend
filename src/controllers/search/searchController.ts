import { NextFunction, Response } from "express";
import asyncHandler from "express-async-handler";
import { ISearchRequest } from "../../config/types";
import { Search } from "../../models/searchModel";

// @desc    save the user's search to the database
// @route   POST /api/search
// @access  Public
const saveSearch = asyncHandler(
  async (
    req: ISearchRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (req.body.keywords === undefined) {
      res.status(400);
      throw new Error("No keywords provided");
    }
    const search = await Search.create({
      keywords: req.body.keywords,
      filters: {
        condition: req.body.condition,
        sortOrder: req.body.sortOrder,
      },
    });
    console.log("Search saved to database: ", search);
    req.search = search.toJSON();
    next();
  }
);

export { saveSearch };
