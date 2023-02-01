import mongoose from "mongoose";

const ebaySearchResultSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const EbaySearchResult = mongoose.model(
  "EbaySearchResult",
  ebaySearchResultSchema
);

export { EbaySearchResult, ebaySearchResultSchema };
