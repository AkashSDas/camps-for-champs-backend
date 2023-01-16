import { CampStatus } from "src/utils/camp";

// eslint-disable-next-line prettier/prettier
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { User } from "../user/schema";
import { CampRepository } from "./camp.repository";
// eslint-disable-next-line prettier/prettier
import { UpdateCancellationPolicyDto, UpdateLocationDto, UpdateStatusDto, UpdateTimingDto } from "./dto";
import { UpdateSettingsDto } from "./dto/update-settings.dto";
import { Camp } from "./schema";

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
}
