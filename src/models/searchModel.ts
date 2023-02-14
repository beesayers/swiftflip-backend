import mongoose from "mongoose";
import { ebaySearchResultSchema } from "./ebaySearchResultModel";

const searchSchema = new mongoose.Schema(
  {
    keywords: String,
    filters: {
      condition: String,
      sortOrder: String,
    },
    ebaySearchResults: [ebaySearchResultSchema],
    stats: {
      min: Number,
      med: Number,
      avg: Number,
      max: Number,
      quantity: Number,
    },
    errorMessage: String,
  },
  {
    timestamps: true,
  }
);

const Search = mongoose.model("Search", searchSchema);

export { Search, searchSchema };
