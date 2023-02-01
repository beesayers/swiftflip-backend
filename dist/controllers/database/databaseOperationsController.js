"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveEbaySearchResult = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ebaySearchResultModel_1 = __importDefault(require("../../models/ebaySearchResultModel"));
// todo: create a types.ts file for ebaySearchResult type
const saveEbaySearchResult = (0, express_async_handler_1.default)(async (req, res, result) => {
    const cleanedResult = cleanForMongo(result);
    const savedResult = await ebaySearchResultModel_1.default.create(cleanedResult);
    console.log(savedResult);
});
exports.saveEbaySearchResult = saveEbaySearchResult;
const cleanForMongo = (result) => {
    const cleanedResult = {
        itemId: result.itemId[0],
        title: result.title[0],
        globalId: result.globalId[0],
        primaryCategory: {
            categoryId: result.primaryCategory[0].categoryId[0],
            categoryName: result.primaryCategory[0].categoryName[0],
        },
        galleryURL: result.galleryURL[0],
        viewItemURL: result.viewItemURL[0],
        autoPay: Boolean(result.autoPay[0]),
        postalCode: result.postalCode[0],
        location: result.location[0],
        country: result.country[0],
        shippingInfo: {
            shippingServiceCost: {
                "@currencyId": result.shippingInfo[0].shippingServiceCost[0]["@currencyId"],
                __value__: Number(result.shippingInfo[0].shippingServiceCost[0].__value__),
            },
            shippingType: result.shippingInfo[0].shippingType[0],
            shipToLocations: result.shippingInfo[0].shipToLocations[0],
            expeditedShipping: Boolean(result.shippingInfo[0].expeditedShipping[0]),
            oneDayShippingAvailable: Boolean(result.shippingInfo[0].oneDayShippingAvailable[0]),
            handlingTime: Number(result.shippingInfo[0].handlingTime[0]),
        },
        sellingStatus: {
            currentPrice: {
                "@currencyId": result.sellingStatus[0].currentPrice[0]["@currencyId"],
                __value__: Number(result.sellingStatus[0].currentPrice[0].__value__),
            },
            convertedCurrentPrice: {
                "@currencyId": result.sellingStatus[0].convertedCurrentPrice[0]["@currencyId"],
                __value__: Number(result.sellingStatus[0].convertedCurrentPrice[0].__value__),
            },
            sellingState: result.sellingStatus[0].sellingState[0],
            timeLeft: result.sellingStatus[0].timeLeft[0],
        },
        listingInfo: {
            bestOfferEnabled: Boolean(result.listingInfo[0].bestOfferEnabled[0]),
            buyItNowAvailable: Boolean(result.listingInfo[0].buyItNowAvailable[0]),
            startTime: result.listingInfo[0].startTime[0],
            endTime: result.listingInfo[0].endTime[0],
            listingType: result.listingInfo[0].listingType[0],
            gift: result.listingInfo[0].gift[0],
            watchCount: result.listingInfo[0].watchCount[0],
        },
        returnsAccepted: result.returnsAccepted[0],
        condition: {
            conditionId: result.condition[0].conditionId[0],
            conditionDisplayName: result.condition[0].conditionDisplayName[0],
        },
        isMultiVariationListing: result.isMultiVariationListing[0],
        topRatedListing: result.topRatedListing[0],
    };
    return cleanedResult;
};
//# sourceMappingURL=databaseOperationsController.js.map