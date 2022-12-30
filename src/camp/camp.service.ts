import * as cloudinary from "cloudinary";
import { UploadedFile } from "express-fileupload";
import { User } from "src/user/schemas";
import { CAMP_IMG_DIR } from "src/utils/cloudinary.util";

// eslint-disable-next-line prettier/prettier
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { CampRepository } from "./camp.repository";
import { DetailsDto, ImageDto, LocationDto } from "./dto";
import { Camp, CampStatus } from "./schemas";
import { Types } from "mongoose";

@Injectable()
export class CampService {
  constructor(private campRepository: CampRepository) {}

  async createCamp(user: User) {
    var camp = this.campRepository.createCamp(user);
    return camp;
  }

  async updateCampDetails(_id: Types.ObjectId, dto: DetailsDto) {
    return await this.campRepository.updateCampDetails(_id, dto);
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

    var idx = camp.images.findIndex(function removeImage(image) {
      return image.id != imageId;
    });
    camp.images.splice(idx, 1);

    await camp.save();
  }

  async reorderCampImages(ids: string[], camp: Camp) {
    var images = camp.images;
    var newImages = [];

    if (ids.length != images.length) {
      throw new BadRequestException("Invalid ids");
    }

    for (let i = 0; i < ids.length; i++) {
      var image = images.find(function findImage(image) {
        return image.id == `${CAMP_IMG_DIR}/${camp._id}/${ids[i]}`;
      });

      if (!image) throw new NotFoundException("Image not found");
      newImages.push(image);
    }

    camp.images = newImages;
    await camp.save();
    return camp;
  }

  async updateCampLocation(dto: LocationDto, camp: Camp) {
    camp.location = dto;
    await camp.save();
    return camp;
  }

  async publishCamp(camp: Camp) {
    camp.status = CampStatus.ACTIVE;
    await camp.save();
    return camp;
  }

  async getCamps() {
    return await this.campRepository.getCamps();
  }

  async getCampsWithStatus(status: CampStatus) {
    return await this.campRepository.getCampsWithStatus(status);
  }

  async deleteCamp(camp: Camp) {
    // Remove all images
    var images = [];
    for (let i = 0; i < camp.images.length; i++) {
      images.push(cloudinary.v2.uploader.destroy(camp.images[i].id));
    }
    await Promise.all(images);

    // Remove camp
    await camp.remove();
  }
}
