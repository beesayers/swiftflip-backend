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
    errorMessage: String,
  },
  {
    timestamps: true,
  }
);

const Search = mongoose.model("Search", searchSchema);

export { Search, searchSchema };
