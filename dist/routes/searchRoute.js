"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRouter = void 0;
const express_1 = __importDefault(require("express"));
const ebaySearchController_1 = require("../controllers/ebay/ebaySearchController");
const searchController_1 = require("../controllers/search/searchController");
exports.searchRouter = express_1.default.Router();
// POST /api/search
exports.searchRouter.route("/").post(searchController_1.saveSearch, ebaySearchController_1.postEbaySearch, ebaySearchController_1.cleanEbaySearchResults, ebaySearchController_1.addStatistics, ebaySearchController_1.saveSearchResults);
//# sourceMappingURL=searchRoute.js.map