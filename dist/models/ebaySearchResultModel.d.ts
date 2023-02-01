import mongoose from "mongoose";
declare const ebaySearchResultSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    itemId?: string | undefined;
    title?: string | undefined;
    globalId?: string | undefined;
    galleryURL?: string | undefined;
    viewItemURL?: string | undefined;
    autoPay?: boolean | undefined;
    postalCode?: string | undefined;
    location?: string | undefined;
    country?: string | undefined;
    returnsAccepted?: boolean | undefined;
    isMultiVariationListing?: boolean | undefined;
    topRatedListing?: boolean | undefined;
    primaryCategory?: {
        categoryId?: string | undefined;
        categoryName?: string | undefined;
    } | undefined;
    shippingInfo?: {
        shippingType?: string | undefined;
        shipToLocations?: string | undefined;
        expeditedShipping?: boolean | undefined;
        oneDayShippingAvailable?: boolean | undefined;
        handlingTime?: number | undefined;
        shippingServiceCost?: {
            "@currencyId"?: string | undefined;
            __value__?: number | undefined;
        } | undefined;
    } | undefined;
    sellingStatus?: {
        sellingState?: string | undefined;
        timeLeft?: string | undefined;
        currentPrice?: {
            "@currencyId"?: string | undefined;
            __value__?: number | undefined;
        } | undefined;
        convertedCurrentPrice?: {
            "@currencyId"?: string | undefined;
            __value__?: number | undefined;
        } | undefined;
    } | undefined;
    listingInfo?: {
        bestOfferEnabled?: boolean | undefined;
        buyItNowAvailable?: boolean | undefined;
        startTime?: Date | undefined;
        endTime?: Date | undefined;
        listingType?: string | undefined;
        gift?: boolean | undefined;
        watchCount?: number | undefined;
    } | undefined;
    condition?: {
        conditionId?: string | undefined;
        conditionDisplayName?: string | undefined;
    } | undefined;
}>;
declare const EbaySearchResult: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    itemId?: string | undefined;
    title?: string | undefined;
    globalId?: string | undefined;
    galleryURL?: string | undefined;
    viewItemURL?: string | undefined;
    autoPay?: boolean | undefined;
    postalCode?: string | undefined;
    location?: string | undefined;
    country?: string | undefined;
    returnsAccepted?: boolean | undefined;
    isMultiVariationListing?: boolean | undefined;
    topRatedListing?: boolean | undefined;
    primaryCategory?: {
        categoryId?: string | undefined;
        categoryName?: string | undefined;
    } | undefined;
    shippingInfo?: {
        shippingType?: string | undefined;
        shipToLocations?: string | undefined;
        expeditedShipping?: boolean | undefined;
        oneDayShippingAvailable?: boolean | undefined;
        handlingTime?: number | undefined;
        shippingServiceCost?: {
            "@currencyId"?: string | undefined;
            __value__?: number | undefined;
        } | undefined;
    } | undefined;
    sellingStatus?: {
        sellingState?: string | undefined;
        timeLeft?: string | undefined;
        currentPrice?: {
            "@currencyId"?: string | undefined;
            __value__?: number | undefined;
        } | undefined;
        convertedCurrentPrice?: {
            "@currencyId"?: string | undefined;
            __value__?: number | undefined;
        } | undefined;
    } | undefined;
    listingInfo?: {
        bestOfferEnabled?: boolean | undefined;
        buyItNowAvailable?: boolean | undefined;
        startTime?: Date | undefined;
        endTime?: Date | undefined;
        listingType?: string | undefined;
        gift?: boolean | undefined;
        watchCount?: number | undefined;
    } | undefined;
    condition?: {
        conditionId?: string | undefined;
        conditionDisplayName?: string | undefined;
    } | undefined;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    itemId?: string | undefined;
    title?: string | undefined;
    globalId?: string | undefined;
    galleryURL?: string | undefined;
    viewItemURL?: string | undefined;
    autoPay?: boolean | undefined;
    postalCode?: string | undefined;
    location?: string | undefined;
    country?: string | undefined;
    returnsAccepted?: boolean | undefined;
    isMultiVariationListing?: boolean | undefined;
    topRatedListing?: boolean | undefined;
    primaryCategory?: {
        categoryId?: string | undefined;
        categoryName?: string | undefined;
    } | undefined;
    shippingInfo?: {
        shippingType?: string | undefined;
        shipToLocations?: string | undefined;
        expeditedShipping?: boolean | undefined;
        oneDayShippingAvailable?: boolean | undefined;
        handlingTime?: number | undefined;
        shippingServiceCost?: {
            "@currencyId"?: string | undefined;
            __value__?: number | undefined;
        } | undefined;
    } | undefined;
    sellingStatus?: {
        sellingState?: string | undefined;
        timeLeft?: string | undefined;
        currentPrice?: {
            "@currencyId"?: string | undefined;
            __value__?: number | undefined;
        } | undefined;
        convertedCurrentPrice?: {
            "@currencyId"?: string | undefined;
            __value__?: number | undefined;
        } | undefined;
    } | undefined;
    listingInfo?: {
        bestOfferEnabled?: boolean | undefined;
        buyItNowAvailable?: boolean | undefined;
        startTime?: Date | undefined;
        endTime?: Date | undefined;
        listingType?: string | undefined;
        gift?: boolean | undefined;
        watchCount?: number | undefined;
    } | undefined;
    condition?: {
        conditionId?: string | undefined;
        conditionDisplayName?: string | undefined;
    } | undefined;
}>>;
export { EbaySearchResult, ebaySearchResultSchema };
