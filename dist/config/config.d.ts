import { v2 as cloudinary } from "cloudinary";
declare const config: {
    db: {
        uri: string;
    };
    server: {
        port: string;
        host: string;
    };
    cloudinary: typeof cloudinary;
    ebay: {
        endpointProd: string;
        appidProd: string;
    };
};
export default config;
