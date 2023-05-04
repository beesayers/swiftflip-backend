"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EbaySearchResultModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ebaySearchResultSchema = new mongoose_1.Schema({
    itemId: String,
    title: String,
    globalId: String,
    primaryCategory: {
        categoryId: String,
        categoryName: String,
    },
    galleryURL: String,
    viewItemURL: String,
    autoPay: Boolean,
    postalCode: String,
    location: String,
    country: String,
    shippingInfo: {
        shippingServiceCost: {
            "@currencyId": String,
            __value__: Number,
        },
        shippingType: String,
        shipToLocations: String,
        expeditedShipping: Boolean,
        oneDayShippingAvailable: Boolean,
        handlingTime: Number,
    },
    sellingStatus: {
        currentPrice: {
            "@currencyId": String,
            __value__: Number,
        },
        convertedCurrentPrice: {
            "@currencyId": String,
            __value__: Number,
        },
        sellingState: String,
        timeLeft: String,
    },
    listingInfo: {
        bestOfferEnabled: Boolean,
        buyItNowAvailable: Boolean,
        startTime: Date,
        endTime: Date,
        listingType: String,
        gift: Boolean,
        watchCount: Number,
    },
    returnsAccepted: Boolean,
    condition: {
        conditionId: String,
        conditionDisplayName: String,
    },
    isMultiVariationListing: Boolean,
    topRatedListing: Boolean,
}, {
    timestamps: true,
});
exports.EbaySearchResultModel = mongoose_1.default.model("EbaySearchResult", ebaySearchResultSchema);
//# sourceMappingURL=ebaySearchResultModel.js.map