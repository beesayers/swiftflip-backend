import mongoose, { Schema } from "mongoose";
import { ISearch } from "../config/types";
import { EbaySearchResultModel } from "./ebaySearchResultModel";

const searchSchema = new Schema<ISearch>(
  {
    keywords: String,
    filters: {
      condition: String,
      sortOrder: String,
    },
    ebaySearchResults: [EbaySearchResultModel.schema],
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

export const SearchModel = mongoose.model<ISearch>("Search", searchSchema);
