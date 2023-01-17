import { v2 } from "cloudinary";

export var CloudinaryProvider = {
  provide: "CampsForChamps",
  useFactory: function connectToCloudinary() {
    return v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
  },
};
