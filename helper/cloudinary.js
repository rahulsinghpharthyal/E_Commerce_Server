import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const storage = new multer.memoryStorage();
const upload = multer({ storage });

console.log('this is cloudName', process.env.CLOUD_NAME);
const imageUploadUtils = async (file) => {
  try {
    console.log('this is paypal mode', process.env.PAYPAL_CLIENT_SECRET);
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return result;
  } catch (err) {
    console.log("Cloudnary Upload Failed");
  }
};


export { imageUploadUtils, upload };
