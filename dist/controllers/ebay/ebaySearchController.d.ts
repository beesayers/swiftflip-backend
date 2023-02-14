/// <reference types="qs" />
/// <reference types="express" />
declare const postEbaySearch: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, {
    keywords?: string | undefined;
    condition?: string | undefined;
    sortOrder?: string | undefined;
}, import("qs").ParsedQs, Record<string, any>>;
declare const cleanEbaySearchResults: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, {
    keywords?: string | undefined;
    condition?: string | undefined;
    sortOrder?: string | undefined;
}, import("qs").ParsedQs, Record<string, any>>;
declare const addStatistics: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, {
    keywords?: string | undefined;
    condition?: string | undefined;
    sortOrder?: string | undefined;
}, import("qs").ParsedQs, Record<string, any>>;
declare const saveSearchResults: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, {
    keywords?: string | undefined;
    condition?: string | undefined;
    sortOrder?: string | undefined;
}, import("qs").ParsedQs, Record<string, any>>;
export { postEbaySearch, cleanEbaySearchResults, addStatistics, saveSearchResults };
