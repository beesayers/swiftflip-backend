"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSearchResults = exports.postEbaySearch = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const searchModel_1 = require("../../models/searchModel");
const EBAY_ENDPOINT_PROD = (_a = process.env.EBAY_ENDPOINT_PROD) !== null && _a !== void 0 ? _a : "";
const EBAY_APPID_PROD = (_b = process.env.EBAY_APPID_PROD) !== null && _b !== void 0 ? _b : "";
const conditionMap = {
    "1000": "New",
    "1500": "New other (see details)",
    "1750": "New with defects",
    "2000": "Certified - Refurbished",
    "2010": "Excellent - Refurbished",
    "2020": "Very Good - Refurbished",
    "2030": "Good - Refurbished",
    "2500": "Seller refurbished",
    "2750": "Like New",
    "3000": "Used",
    "4000": "Very Good",
    "5000": "Good",
    "6000": "Acceptable",
    "7000": "For parts or not working",
};
// @desc    Ebay search endpoint
// @route   POST /api/ebay/search
// @access  Public
const postEbaySearch = (0, express_async_handler_1.default)(async (req, res, next) => {
    if (req.search === undefined) {
        res.status(400);
        throw new Error("No search provided to ebaySearchController");
    }
    const OPERATION_NAME = "findItemsAdvanced";
    const SECURITY_APPNAME = EBAY_APPID_PROD;
    const REQUEST_DATA_FORMAT = "JSON";
    const RESPONSE_DATA_FORMAT = "JSON";
    const url = `${EBAY_ENDPOINT_PROD}?OPERATION-NAME=${OPERATION_NAME}&SECURITY-APPNAME=${SECURITY_APPNAME}&RESPONSE-DATA-FORMAT=${RESPONSE_DATA_FORMAT}&REQUEST-DATA-FORMAT=${REQUEST_DATA_FORMAT}`;
    const keywords = req.body.keywords;
    const sortOrder = req.body.sortOrder;
    const itemFilter = [];
    const condition = req.body.condition;
    if (condition !== undefined && conditionMap[condition] !== undefined) {
        itemFilter.push({
            name: "Condition",
            value: condition,
        });
    }
    const body = {
        keywords,
        sortOrder,
        itemFilter,
    };
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    };
    const response = await fetch(url, options);
    const json = await response.json();
    const countResults = json.findItemsAdvancedResponse[0].searchResult[0]["@count"];
    const ebaySearchResults = json.findItemsAdvancedResponse[0].searchResult[0].item;
    console.log(`Call to Ebay API successful with ${countResults} results.`);
    req.ebay = {
        searchResults: ebaySearchResults,
        searchCount: parseInt(countResults),
    };
    next();
});
exports.postEbaySearch = postEbaySearch;
const saveSearchResults = (0, express_async_handler_1.default)(async (req, res, next) => {
    if (req.search === undefined ||
        req.ebay === undefined ||
        req.ebay.searchResults === undefined ||
        req.ebay.searchCount === undefined) {
        res.status(400);
        throw new Error("No ebaySearchResults provided to ebaySearchController");
    }
    let counter = 0;
    const cleanedResults = [];
    console.log(`Saving ${req.ebay.searchCount.toString()} results to database.`);
    for (const key in req.ebay.searchResults) {
        const cleanedResult = cleanEbaySearchResult(req.ebay.searchResults[key]);
        cleanedResults.push(cleanedResult);
        console.log(`---- Result ${++counter} saved to database`);
    }
    const searchDocument = await searchModel_1.Search.findOneAndUpdate({
        _id: req.search._id,
    }, {
        ebaySearchResults: cleanedResults,
    }, {
        new: true,
    });
    res.json(searchDocument);
});
exports.saveSearchResults = saveSearchResults;
const cleanEbaySearchResult = (result) => {
    try {
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
            autoPay: result.autoPay[0],
            postalCode: result.postalCode === undefined ? "" : result.postalCode[0],
            location: result.location[0],
            country: result.country[0],
            shippingInfo: {
                shippingServiceCost: {
                    "@currencyId": result.shippingInfo[0].shippingServiceCost === undefined
                        ? ""
                        : result.shippingInfo[0].shippingServiceCost[0]["@currencyId"],
                    __value__: result.shippingInfo[0].shippingServiceCost === undefined
                        ? 0
                        : result.shippingInfo[0].shippingServiceCost[0].__value__,
                },
                shippingType: result.shippingInfo[0].shippingType[0],
                shipToLocations: result.shippingInfo[0].shipToLocations[0],
                expeditedShipping: result.shippingInfo[0].expeditedShipping[0],
                oneDayShippingAvailable: result.shippingInfo[0].oneDayShippingAvailable[0],
                handlingTime: result.shippingInfo[0].handlingTime[0],
            },
            sellingStatus: {
                currentPrice: {
                    "@currencyId": result.sellingStatus[0].currentPrice[0]["@currencyId"],
                    __value__: result.sellingStatus[0].currentPrice[0].__value__,
                },
                convertedCurrentPrice: {
                    "@currencyId": result.sellingStatus[0].convertedCurrentPrice[0]["@currencyId"],
                    __value__: result.sellingStatus[0].convertedCurrentPrice[0].__value__,
                },
                sellingState: result.sellingStatus[0].sellingState[0],
                timeLeft: result.sellingStatus[0].timeLeft[0],
            },
            listingInfo: {
                bestOfferEnabled: result.listingInfo[0].bestOfferEnabled[0],
                buyItNowAvailable: result.listingInfo[0].buyItNowAvailable[0],
                startTime: result.listingInfo[0].startTime[0],
                endTime: result.listingInfo[0].endTime[0],
                listingType: result.listingInfo[0].listingType[0],
                gift: result.listingInfo[0].gift[0],
                watchCount: result.listingInfo[0].watchCount === undefined ? 0 : result.listingInfo[0].watchCount[0],
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
    }
    catch (error) {
        console.log(error);
    }
};
//# sourceMappingURL=ebaySearchController.js.map