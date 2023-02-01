"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ebaySearchRouter = void 0;
const express_1 = __importDefault(require("express"));
const ebaySearchController_1 = require("../../controllers/ebay/ebaySearchController");
const ebaySearchRouter = express_1.default.Router();
exports.ebaySearchRouter = ebaySearchRouter;
// POST /api/ebay/search
ebaySearchRouter.route("/").post(ebaySearchController_1.postEbaySearch);
//# sourceMappingURL=ebaySearchRoute.js.map