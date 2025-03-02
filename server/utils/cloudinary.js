import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dgom89a4k",
  api_key: process.env.CLOUDINARY_API_KEY || "169519131778876",
  api_secret: process.env.CLOUDINARY_API_SECRET || "XIzOR2Boy-xVpAXXScnWxZt-Bqk"
});

export default cloudinary;
