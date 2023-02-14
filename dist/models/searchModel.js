"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSchema = exports.Search = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ebaySearchResultModel_1 = require("./ebaySearchResultModel");
const searchSchema = new mongoose_1.default.Schema({
    keywords: String,
    filters: {
        condition: String,
        sortOrder: String,
    },
    ebaySearchResults: [ebaySearchResultModel_1.ebaySearchResultSchema],
    stats: {
        min: Number,
        med: Number,
        avg: Number,
        max: Number,
        quantity: Number,
    },
    errorMessage: String,
}, {
    timestamps: true,
});
exports.searchSchema = searchSchema;
const Search = mongoose_1.default.model("Search", searchSchema);
exports.Search = Search;
//# sourceMappingURL=searchModel.js.map