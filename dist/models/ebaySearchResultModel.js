"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ebaySearchResultSchema = exports.EbaySearchResult = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ebaySearchResultSchema = new mongoose_1.default.Schema({
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
exports.ebaySearchResultSchema = ebaySearchResultSchema;
const EbaySearchResult = mongoose_1.default.model("EbaySearchResult", ebaySearchResultSchema);
exports.EbaySearchResult = EbaySearchResult;
//# sourceMappingURL=ebaySearchResultModel.js.map