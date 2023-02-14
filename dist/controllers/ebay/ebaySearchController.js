"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSearchResults = exports.addStatistics = exports.cleanEbaySearchResults = exports.postEbaySearch = void 0;
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
    ebaySearchResults === undefined
        ? countResults === "0"
            ? console.log(`2. No results returned from Ebay API.`)
            : console.log(`2. Error when calling Ebay API.`)
        : console.log(`2. Successful call to Ebay API. Returned ${countResults} results.`);
    if (countResults !== "0") {
        req.ebay = {
            searchResults: ebaySearchResults,
        };
        next();
    }
    else {
        res.status(200);
        res.json({
            _id: req.search._id,
            message: "No results found.",
            stats: {
                quantity: 0,
            },
        });
    }
});
exports.postEbaySearch = postEbaySearch;
const cleanEbaySearchResults = (0, express_async_handler_1.default)(async (req, res, next) => {
    var _a;
    if (req.search === undefined || ((_a = req.ebay) === null || _a === void 0 ? void 0 : _a.searchResults) === undefined) {
        res.status(400);
        throw new Error("No ebaySearchResults provided to ebaySearchController");
    }
    const cleanedResults = [];
    for (const key in req.ebay.searchResults) {
        const cleanedResult = cleanEbaySearchResult(req.ebay.searchResults[key]);
        cleanedResults.push(cleanedResult);
    }
    if (cleanedResults.length === 0) {
        console.log("3. Error cleaning Ebay search results.");
    }
    else {
        console.log(`3. Successfully cleaned ${cleanedResults.length} Ebay search results.`);
    }
    req.ebay = {
        ...req.ebay,
        cleanedResults,
    };
    next();
});
exports.cleanEbaySearchResults = cleanEbaySearchResults;
const addStatistics = (0, express_async_handler_1.default)(async (req, res, next) => {
    var _a, _b, _c, _d, _e;
    const sortedResults = [...((_b = (_a = req === null || req === void 0 ? void 0 : req.ebay) === null || _a === void 0 ? void 0 : _a.cleanedResults) !== null && _b !== void 0 ? _b : [])];
    sortedResults.sort((a, b) => a.sellingStatus.currentPrice.__value__ - b.sellingStatus.currentPrice.__value__);
    if (sortedResults.length === 0) {
        console.log("4. Error adding statistics.");
        throw new Error("Error adding statistics. Maybe no results?");
    }
    const min = Math.min(...((_c = sortedResults.map((result) => result.sellingStatus.currentPrice.__value__)) !== null && _c !== void 0 ? _c : [-1]));
    const med = (_d = sortedResults[Math.floor(sortedResults.length / 2)].sellingStatus.currentPrice.__value__) !== null && _d !== void 0 ? _d : -1;
    const avg = sortedResults.reduce((acc, result) => acc + Number(result.sellingStatus.currentPrice.__value__), 0) /
        sortedResults.length;
    const max = Math.max(...((_e = sortedResults.map((result) => result.sellingStatus.currentPrice.__value__)) !== null && _e !== void 0 ? _e : [-1]));
    const quantity = sortedResults.length;
    if (req.ebay !== undefined) {
        req.ebay.stats = {
            min,
            med,
            avg,
            max,
            quantity,
        };
    }
    console.log(`4. Successfully added statistics.`);
    console.log(`---- min: ${min}`);
    console.log(`---- med: ${med}`);
    console.log(`---- avg: ${avg}`);
    console.log(`---- max: ${max}`);
    console.log(`---- quantity: ${quantity}`);
    next();
});
exports.addStatistics = addStatistics;
const saveSearchResults = (0, express_async_handler_1.default)(async (req, res, next) => {
    var _a;
    if (req.search === undefined || ((_a = req.ebay) === null || _a === void 0 ? void 0 : _a.cleanedResults) === undefined) {
        res.status(400);
        throw new Error("No ebaySearchResults provided to ebaySearchController");
    }
    const searchDocument = await searchModel_1.Search.findOneAndUpdate({
        _id: req.search._id,
    }, {
        ebaySearchResults: req.ebay.cleanedResults,
        stats: req.ebay.stats,
    }, {
        new: true,
    });
    searchDocument === undefined
        ? console.log("5. Error saving Ebay search results to database.")
        : console.log("5. Successfully saved Ebay search results to database.");
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