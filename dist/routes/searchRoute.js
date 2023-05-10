"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRouter = void 0;
const express_1 = __importDefault(require("express"));
const searchController_1 = require("../controllers/search/searchController");
const authMiddleware_1 = require("../middleware/authMiddleware");
exports.searchRouter = express_1.default.Router();
// POST /api/search
exports.searchRouter
    .route("/")
    .post(authMiddleware_1.requireAuth, searchController_1.saveSearch, searchController_1.postEbaySearch, searchController_1.cleanEbaySearchResults, searchController_1.addStatistics, searchController_1.saveSearchResults);
//# sourceMappingURL=searchRoute.js.map