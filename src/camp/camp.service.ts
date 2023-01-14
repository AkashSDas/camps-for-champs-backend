import { Injectable } from "@nestjs/common";

import { User } from "../user/schema";
import { CampRepository } from "./camp.repository";
import { UpdateTimingDto } from "./dto";
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
}
