import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const config = {
  db: {
    uri: process.env.MONGO_URI ?? "",
  },
  server: {
    port: process.env.PORT ?? "",
    host: process.env.HOST ?? "",
  },
  cloudinary,
  ebay: {
    endpointProd: process.env.EBAY_ENDPOINT_PROD ?? "",
    appidProd: process.env.EBAY_APPID_PROD ?? "",
  },
};

export default config;
