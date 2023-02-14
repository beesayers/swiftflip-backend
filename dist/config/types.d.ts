import { Request } from "express";
export interface IEbaySearchResult {
    itemId: string;
    title: string;
    globalId: string;
    primaryCategory: {
        categoryId: string;
        categoryName: string;
    };
    galleryURL: string;
    viewItemURL: string;
    autoPay: boolean;
    postalCode: string;
    location: string;
    country: string;
    shippingInfo: {
        shippingServiceCost: {
            "@currencyId": string;
            __value__: number;
        };
        shippingType: string;
        shipToLocations: string;
        expeditedShipping: boolean;
        oneDayShippingAvailable: boolean;
        handlingTime: number;
    };
    sellingStatus: {
        currentPrice: {
            "@currencyId": string;
            __value__: number;
        };
        convertedCurrentPrice: {
            "@currencyId": string;
            __value__: number;
        };
        sellingState: string;
        timeLeft: string;
    };
    listingInfo: {
        bestOfferEnabled: boolean;
        buyItNowAvailable: boolean;
        startTime: Date;
        endTime: Date;
        listingType: string;
        gift: boolean;
        watchCount: number;
    };
    returnsAccepted: boolean;
    condition: {
        conditionId: string;
        conditionDisplayName: string;
    };
    isMultiVariationListing: boolean;
    topRatedListing: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}
export interface ISearchRequest extends Request {
    body: {
        keywords?: string;
        condition?: string;
        sortOrder?: string;
    };
    search?: {
        _id: string;
        keywords: string;
        filters: {
            condition: string;
            sortOrder: string;
        };
        ebaySearchResults: IEbaySearchResult[];
        errorMessage: string;
        createdAt: Date;
        updatedAt: Date;
        __v: number;
    };
    ebay?: {
        searchResults: [unknown];
        cleanedResults?: IEbaySearchResult[];
        stats?: {
            min: number;
            med: number;
            avg: number;
            max: number;
            quantity: number;
        };
    };
}
