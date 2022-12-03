import { User } from "src/user/schemas";

import { Injectable } from "@nestjs/common";

import { CampRepository } from "./camp.repository";
import { DetailsDto } from "./dto";
import { Camp } from "./schemas";

@Injectable()
export class CampService {
  constructor(private campRepository: CampRepository) {}

  // =============================
  // CAMP
  // =============================

  async createCamp(user: User) {
    var camp = this.campRepository.createCamp(user);
    return camp;
  }

  async updateCampDetails(dto: DetailsDto, camp: Camp) {
    return await this.campRepository.updateCampDetails(dto, camp);
  }
}
