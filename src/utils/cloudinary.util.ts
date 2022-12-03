import cloudinary from "cloudinary";

export async function connectToCloudinary() {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
}

export const CAMP_IMG_DIR = "campsforchamps/camps";
