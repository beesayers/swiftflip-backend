"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSearch = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const searchModel_1 = require("../../models/searchModel");
// @desc    save the user's search to the database
// @route   POST /api/search
// @access  Public
const saveSearch = (0, express_async_handler_1.default)(async (req, res, next) => {
    if (req.body.keywords === undefined) {
        res.status(400);
        throw new Error("No keywords provided");
    }
    const search = await searchModel_1.Search.create({
        keywords: req.body.keywords,
        filters: {
            condition: req.body.condition,
            sortOrder: req.body.sortOrder,
        },
    });
    console.log("\n1. Search request received for: ", search.keywords);
    req.search = search.toJSON();
    next();
});
exports.saveSearch = saveSearch;
//# sourceMappingURL=searchController.js.map