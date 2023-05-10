import { Request } from "express";
import { Document } from "mongoose";
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
        keywords: string;
        condition: string;
        sortOrder: string;
    };
    search?: ISearch;
    session?: IUserSession;
    rawEbayResults?: any;
    cleanEbayResults?: IEbaySearchResult[];
    stats?: {
        min: number;
        med: number;
        avg: number;
        max: number;
        quantity: number;
    };
}
export interface ISearch extends Document {
    userAccount: IUserAccount;
    keywords: string;
    filters: {
        condition: string;
        sortOrder: string;
    };
    ebaySearchResults: IEbaySearchResult[];
    stats: {
        min: number;
        med: number;
        avg: number;
        max: number;
        quantity: number;
    };
    errorMessage: string;
}
export interface IUserActivity extends Document {
    userAccount: IUserAccount;
    activityType: string;
    activityDetails: string;
    createdAt: Date;
}
export interface IUserAccount extends Document {
    email: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
    subscription: string;
    password: string;
    userSessions: IUserSession[];
    searchHistory: ISearch[];
    userActivity: IUserActivity[];
    createdAt: Date;
    updatedAt: Date;
    comparePassword: (password: string) => Promise<boolean>;
    createSession: () => Promise<IUserSession>;
    createActivity: (activityType: string, activityDetails: string) => Promise<IUserActivity>;
    revokeSession: (token: string) => Promise<IUserSession>;
}
export interface IUserSession extends Document {
    userAccount: IUserAccount;
    token: string;
    expiresAt: Date;
    isValidToken: (token: string) => Promise<boolean>;
}
