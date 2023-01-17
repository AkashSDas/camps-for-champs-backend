import { v2 } from "cloudinary";
import { UploadedFile } from "express-fileupload";

// eslint-disable-next-line prettier/prettier
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { User } from "../user/schema";
import { CampStatus } from "../utils/camp";
import { CampRepository } from "./camp.repository";
// eslint-disable-next-line prettier/prettier
import { AddImageDto, RemoveImageDto, UpdateCancellationPolicyDto, UpdateLocationDto, UpdateStatusDto, UpdateTimingDto } from "./dto";
import { UpdateSettingsDto } from "./dto/update-settings.dto";
import { Camp, Image, ImageType } from "./schema";

@Injectable()
export class CampService {
  constructor(private repository: CampRepository) {}

  async createCamp(user: User) {
    var camp = await this.repository.create({ user: user._id });
    return camp;
  }

  async deleteCamp(camp: Camp) {
    var result = await this.repository.delete({ _id: camp._id });
    if (!result) return new NotFoundException("Camp not found");
    return result;
  }

  async getPublicCamps() {
    var camps = await this.repository.find({
      status: { $eq: CampStatus.ACTIVE },
    });

    return camps;
  }

  async getCamps() {
    var camps = await this.repository.find({});
    return camps;
  }

  // =====================================
  // Update Camp Settings Services
  // =====================================

  async updateSettings(camp: Camp, dto: UpdateSettingsDto) {
    var updatedCamp = await this.repository.update({ _id: camp._id }, dto);
    return updatedCamp;
  }

  async updateTiming(camp: Camp, dto: UpdateTimingDto) {
    var updatedCamp = await this.repository.update({ _id: camp._id }, dto);
    return updatedCamp;
  }

  async updateLocation(camp: Camp, dto: UpdateLocationDto) {
    if (dto.coordinates) {
      var coordinates = dto.coordinates.split(",").map((x) => parseFloat(x));
      if (!camp.location) camp.location = { type: "Point", coordinates };
      else camp.location.coordinates = coordinates;
    }

    if (dto.address) camp.address = dto.address;
    if (dto.googleMapURL) camp.googleMapURL = dto.googleMapURL;

    await camp.save();
    return camp;
  }

  async updateCancellationPolicy(camp: Camp, dto: UpdateCancellationPolicyDto) {
    var updatedCamp = await this.repository.update(
      { _id: camp._id },
      { cancellationPolicy: dto },
    );

    return updatedCamp;
  }

  async updateStatus(camp: Camp, dto: UpdateStatusDto) {
    var status = dto.status;

    if (status == CampStatus.ACTIVE) {
      // Check if the necessary information is present
      if (
        !camp.location ||
        !camp.price ||
        !camp.campLimit ||
        !camp.cancellationPolicy ||
        !camp.startDate ||
        !camp.endDate ||
        !camp.googleMapURL ||
        !camp.address ||
        !camp.name ||
        !camp.about
      ) {
        return new BadRequestException("Incomplete camp");
      }

      // Check if the camp is already active
      if (camp.status == CampStatus.ACTIVE) {
        return new BadRequestException("Camp is already active");
      }

      // Activate the camp
      camp.status = CampStatus.ACTIVE;
    } else if (status == CampStatus.INACTIVE) {
      // Check if the camp is already inactive
      if (camp.status == CampStatus.INACTIVE) {
        return new BadRequestException("Camp is already inactive");
      }

      // Inactivate the camp
      camp.status = CampStatus.INACTIVE;
    } else {
      return camp;
    }

    await camp.save();
    return camp;
  }

  async addImage(camp: Camp, dto: AddImageDto, file?: UploadedFile) {
    // Remove old location img if it exists
    if (dto.type == ImageType.LOCATION) {
      let locationImage: Image;

      camp.images = camp.images.filter((img) => {
        if (img.type != ImageType.LOCATION) {
          locationImage = img;
          return false;
        }
        return false;
      });

      if (locationImage && locationImage.id) {
        await v2.uploader.destroy(
          `${process.env.CLOUDINARY_DIR_CAMP}/${locationImage.id}`,
        );
      }
    }

    if (!file) {
      // Check for the URL for the image
      if (!dto.URL) return new Error("Image URL not provided");
      let img: Image = { type: dto.type, URL: dto.URL };
      if (dto.description) img.description = dto.description;
      camp.images.push(img);
      await camp.save();

      return { camp, image: camp.images[camp.images.length - 1] };
    } else {
      let result = await v2.uploader.upload(file.tempFilePath, {
        folder: `${process.env.CLOUDINARY_DIR_CAMP}/${camp.campId}`,
      });
      if (!result) return new Error("Failed to upload image");

      let img: Image = {
        type: dto.type,
        URL: result.secure_url,
        id: result.public_id.split("/").pop(),
      };
      if (dto.description) img.description = dto.description;
      camp.images.push(img);
      return { camp, image: camp.images[camp.images.length - 1] };
    }
  }

  async removeImage(camp: Camp, image: RemoveImageDto) {
    if (!image.id) {
      // Remove image using the URL
      camp.images = camp.images.filter((img) => img.URL != image.URL);
      await camp.save();
    } else {
      // Remove image using the ID
      camp.images = camp.images.filter((img) => img.id != image.id);

      Promise.all([
        await camp.save(),
        await v2.uploader.destroy(
          `${process.env.CLOUDINARY_DIR_CAMP}/${image.id}`,
        ),
      ]);
    }

    return camp;
  }
}
