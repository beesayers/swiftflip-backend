/// <reference types="qs" />
/// <reference types="express" />
export declare const saveSearch: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, {
    keywords: string;
    condition: string;
    sortOrder: string;
}, import("qs").ParsedQs, Record<string, any>>;
export declare const postEbaySearch: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, {
    keywords: string;
    condition: string;
    sortOrder: string;
}, import("qs").ParsedQs, Record<string, any>>;
export declare const cleanEbaySearchResults: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, {
    keywords: string;
    condition: string;
    sortOrder: string;
}, import("qs").ParsedQs, Record<string, any>>;
export declare const addStatistics: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, {
    keywords: string;
    condition: string;
    sortOrder: string;
}, import("qs").ParsedQs, Record<string, any>>;
export declare const saveSearchResults: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, {
    keywords: string;
    condition: string;
    sortOrder: string;
}, import("qs").ParsedQs, Record<string, any>>;
