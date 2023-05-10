import { NextFunction, Response } from "express";
import asyncHandler from "express-async-handler";
import config from "../../config/config";
import { ISearchRequest } from "../../config/types";
import { SearchModel } from "../../models/searchModel";

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

export const saveSearch = asyncHandler(
  async (req: ISearchRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("\n1. Search request received for: ", req.body.keywords);

    if (req.body.keywords === undefined || req.body.condition === undefined || req.body.sortOrder === null) {
      res.status(400);
      throw new Error("User did not provide required fields in search request");
    }

    // Check if the user is logged in
    if (req.session?.userAccount == null) {
      res.status(400);
      throw new Error("Session or User Account not found");
    }

    // Create the search
    const search = await SearchModel.create({
      userAccount: req.session.userAccount._id,
      keywords: req.body.keywords,
      filters: {
        condition: req.body.condition,
        sortOrder: req.body.sortOrder,
      },
    });
    if (search == null) {
      res.status(400);
      throw new Error("Search could not be created");
    }

    // Save the search to the user's account
    req.session.userAccount.searchHistory.push(search._id);
    await req.session.userAccount.save();

    req.search = search;
    next();
  }
);

export const postEbaySearch = asyncHandler(
  async (req: ISearchRequest, res: Response, next: NextFunction): Promise<void> => {
    if (req.search === undefined) {
      res.status(400);
      throw new Error("No search provided");
    }
    const OPERATION_NAME = "findItemsAdvanced";
    const SECURITY_APPNAME = config.ebay.appidProd;
    const REQUEST_DATA_FORMAT = "JSON";
    const RESPONSE_DATA_FORMAT = "JSON";
    const url = `${config.ebay.endpointProd}?OPERATION-NAME=${OPERATION_NAME}&SECURITY-APPNAME=${SECURITY_APPNAME}&RESPONSE-DATA-FORMAT=${RESPONSE_DATA_FORMAT}&REQUEST-DATA-FORMAT=${REQUEST_DATA_FORMAT}`;

    const keywords = req.body.keywords;
    const sortOrder = req.body.sortOrder;
    const itemFilter: Array<{ name: string; value: string }> = [];
    const condition = req.body.condition;

    if (conditionMap[condition] !== undefined) {
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

    const ebayResponse = await fetch(url, options);
    const json = await ebayResponse.json();
    const countResults: string = json.findItemsAdvancedResponse[0].searchResult[0]["@count"];
    const ebaySearchResults = json.findItemsAdvancedResponse[0].searchResult[0].item;

    ebaySearchResults === undefined
      ? countResults === "0"
        ? console.log(`2. No results returned from Ebay API.`)
        : console.log(`2. Error when calling Ebay API.`)
      : console.log(`2. Successful call to Ebay API. Returned ${countResults} results.`);

    if (countResults !== "0") {
      req.rawEbayResults = ebaySearchResults;
      next();
    } else {
      res.json({
        _id: req.search._id,
        message: "No results found.",
        stats: {
          quantity: 0,
        },
      });
    }
  }
);

export const cleanEbaySearchResults = asyncHandler(
  async (req: ISearchRequest, res: Response, next: NextFunction): Promise<void> => {
    if (req.search === undefined || req.rawEbayResults === undefined) {
      res.status(400);
      throw new Error("No raw ebay results provided.");
    }

    const cleanEbayResults = [];

    for (const key in req.rawEbayResults) {
      const cleanResult = cleanEbaySearchResult(req.rawEbayResults[key]);
      cleanEbayResults.push(cleanResult);
    }

    if (cleanEbayResults.length === 0) {
      console.log("3. Error cleaning Ebay search results.");
      res.status(400);
      throw new Error("Error cleaning Ebay search results.");
    }

    console.log(`3. Successfully cleaned ${cleanEbayResults.length} Ebay search results.`);
    req.cleanEbayResults = cleanEbayResults;
    next();
  }
);

export const addStatistics = asyncHandler(
  async (req: ISearchRequest, res: Response, next: NextFunction): Promise<void> => {
    if (req.search === undefined || req.cleanEbayResults === undefined) {
      res.status(400);
      throw new Error("No clean ebay results provided.");
    }

    const sortedResults = [...req.cleanEbayResults];
    sortedResults.sort((a, b) => a.sellingStatus.currentPrice.__value__ - b.sellingStatus.currentPrice.__value__);

    if (sortedResults.length === 0) {
      console.log("4. Error sorting Ebay search results");
      res.status(400);
      throw new Error("Error sorting Ebay search results");
    }

    const min: number = Math.min(
      ...(sortedResults.map((result) => result.sellingStatus.currentPrice.__value__) ?? [-1])
    );
    const med: number = sortedResults[Math.floor(sortedResults.length / 2)].sellingStatus.currentPrice.__value__ ?? -1;
    const avg: number =
      sortedResults.reduce((acc, result) => acc + Number(result.sellingStatus.currentPrice.__value__), 0) /
      sortedResults.length;
    const max: number = Math.max(
      ...(sortedResults.map((result) => result.sellingStatus.currentPrice.__value__) ?? [-1])
    );
    const quantity: number = sortedResults.length;

    req.stats = {
      min,
      med,
      avg,
      max,
      quantity,
    };

    console.log(`4. Successfully added statistics.`);
    console.log(`---- min: ${min}`);
    console.log(`---- med: ${med}`);
    console.log(`---- avg: ${avg}`);
    console.log(`---- max: ${max}`);
    console.log(`---- quantity: ${quantity}`);

    next();
  }
);

export const saveSearchResults = asyncHandler(
  async (req: ISearchRequest, res: Response, next: NextFunction): Promise<void> => {
    if (req.search === undefined || req.cleanEbayResults === undefined || req.stats === undefined) {
      res.status(400);
      throw new Error("Error saving Ebay search results to database. Likely caused by req.stats.");
    }

    req.search.ebaySearchResults = req.cleanEbayResults;
    req.search.stats = req.stats;

    const searchDocument = await req.search.save();
    if (searchDocument === undefined) {
      console.log("5. Error saving Ebay search results to database.");
      res.status(400);
      throw new Error("Error saving Ebay search results to database.");
    }

    console.log("5. Successfully saved Ebay search results to database.");
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
              ? -1
              : result.shippingInfo[0].shippingServiceCost[0].__value__,
        },
        shippingType: result.shippingInfo[0].shippingType[0],
        shipToLocations: result.shippingInfo[0].shipToLocations[0],
        expeditedShipping: result.shippingInfo[0].expeditedShipping[0],
        oneDayShippingAvailable: result.shippingInfo[0].oneDayShippingAvailable[0],
        handlingTime: result.shippingInfo[0].handlingTime === undefined ? -1 : result.shippingInfo[0].handlingTime[0],
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
    console.log(result);
  }
};
