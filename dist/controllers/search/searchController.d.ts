/// <reference types="qs" />
/// <reference types="express" />
declare const saveSearch: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, {
    keywords?: string | undefined;
    condition?: string | undefined;
    sortOrder?: string | undefined;
}, import("qs").ParsedQs, Record<string, any>>;
export { saveSearch };
