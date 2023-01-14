import { Injectable } from "@nestjs/common";

import { User } from "../user/schema";
import { CampRepository } from "./camp.repository";
import { UpdateLocationDto, UpdateTimingDto } from "./dto";
import { UpdateSettingsDto } from "./dto/update-settings.dto";
import { Camp } from "./schema";

@Injectable()
export class CampService {
  constructor(private repository: CampRepository) {}

  async createCamp(user: User) {
    var camp = await this.repository.create({ user: user._id });
    return camp;
  }

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

    var updatedCamp = await this.repository.update(
      { _id: camp._id },
      coordinates ? { ...dto, location: camp.location } : dto,
    );
    return updatedCamp;
  }
}
