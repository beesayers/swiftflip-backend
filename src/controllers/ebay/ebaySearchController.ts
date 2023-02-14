import { NextFunction, Response } from "express";
import asyncHandler from "express-async-handler";
import { ISearchRequest } from "../../config/types";
import { Search } from "../../models/searchModel";

const EBAY_ENDPOINT_PROD = process.env.EBAY_ENDPOINT_PROD ?? "";
const EBAY_APPID_PROD = process.env.EBAY_APPID_PROD ?? "";

const conditionMap: Record<string, string> = {
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
const postEbaySearch = asyncHandler(async (req: ISearchRequest, res: Response, next: NextFunction): Promise<void> => {
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
  const itemFilter: Array<{ name: string; value: string }> = [];
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
  const countResults: string = json.findItemsAdvancedResponse[0].searchResult[0]["@count"];
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
  } else {
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

const cleanEbaySearchResults = asyncHandler(
  async (req: ISearchRequest, res: Response, next: NextFunction): Promise<void> => {
    if (req.search === undefined || req.ebay?.searchResults === undefined) {
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
    } else {
      console.log(`3. Successfully cleaned ${cleanedResults.length} Ebay search results.`);
    }

    req.ebay = {
      ...req.ebay,
      cleanedResults,
    };

    next();
  }
);

const addStatistics = asyncHandler(async (req: ISearchRequest, res: Response, next: NextFunction): Promise<void> => {
  const sortedResults = [...(req?.ebay?.cleanedResults ?? [])];
  sortedResults.sort((a, b) => a.sellingStatus.currentPrice.__value__ - b.sellingStatus.currentPrice.__value__);
  if (sortedResults.length === 0) {
    console.log("4. Error adding statistics.");
    throw new Error("Error adding statistics. Maybe no results?");
  }

  const min: number = Math.min(...(sortedResults.map((result) => result.sellingStatus.currentPrice.__value__) ?? [-1]));
  const med: number = sortedResults[Math.floor(sortedResults.length / 2)].sellingStatus.currentPrice.__value__ ?? -1;
  const avg: number =
    sortedResults.reduce((acc, result) => acc + Number(result.sellingStatus.currentPrice.__value__), 0) /
    sortedResults.length;
  const max: number = Math.max(...(sortedResults.map((result) => result.sellingStatus.currentPrice.__value__) ?? [-1]));
  const quantity: number = sortedResults.length;

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

const saveSearchResults = asyncHandler(
  async (req: ISearchRequest, res: Response, next: NextFunction): Promise<void> => {
    if (req.search === undefined || req.ebay?.cleanedResults === undefined) {
      res.status(400);
      throw new Error("No ebaySearchResults provided to ebaySearchController");
    }
    const searchDocument = await Search.findOneAndUpdate(
      {
        _id: req.search._id,
      },
      {
        ebaySearchResults: req.ebay.cleanedResults,
        stats: req.ebay.stats,
      },
      {
        new: true,
      }
    );

    searchDocument === undefined
      ? console.log("5. Error saving Ebay search results to database.")
      : console.log("5. Successfully saved Ebay search results to database.");
    res.json(searchDocument);
  }
);

const cleanEbaySearchResult = (result: any): any => {
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
          "@currencyId":
            result.shippingInfo[0].shippingServiceCost === undefined
              ? ""
              : result.shippingInfo[0].shippingServiceCost[0]["@currencyId"],
          __value__:
            result.shippingInfo[0].shippingServiceCost === undefined
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
  } catch (error) {
    console.log(error);
  }
};

export { postEbaySearch, cleanEbaySearchResults, addStatistics, saveSearchResults };
