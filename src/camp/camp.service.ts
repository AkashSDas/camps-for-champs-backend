import { User } from "src/user/schemas";

import { Injectable } from "@nestjs/common";

import { CampRepository } from "./camp.repository";

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
}
