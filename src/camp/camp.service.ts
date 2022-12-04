import * as cloudinary from "cloudinary";
import { UploadedFile } from "express-fileupload";
import { User } from "src/user/schemas";
import { CAMP_IMG_DIR } from "src/utils/cloudinary.util";

import { Injectable } from "@nestjs/common";

import { CampRepository } from "./camp.repository";
import { DetailsDto, ImageDto } from "./dto";
import { Camp } from "./schemas";

@Injectable()
export class CampService {
  constructor(private campRepository: CampRepository) {}

  async createCamp(user: User) {
    var camp = this.campRepository.createCamp(user);
    return camp;
  }

  async updateCampDetails(dto: DetailsDto, camp: Camp) {
    return await this.campRepository.updateCampDetails(dto, camp);
  }

  async addCampImage(dto: ImageDto, camp: Camp, image: UploadedFile) {
    var result = await cloudinary.v2.uploader.upload(image.tempFilePath, {
      folder: `${CAMP_IMG_DIR}/${camp._id}`,
    });

    camp.images.push({
      URL: result.secure_url,
      id: result.public_id,
      type: dto.type,
      description: dto.description,
    });

    camp = await camp.save();
    return { camp, image: camp.images[camp.images.length - 1] };
  }

  async removeCampImage(imageId: string, camp: Camp) {
    await cloudinary.v2.uploader.destroy(
      `${CAMP_IMG_DIR}/${camp._id}/${imageId}`,
    );

    camp.images = camp.images.filter(function removeImage(image) {
      return image.id != imageId;
    });

    await camp.save();
  }
}
