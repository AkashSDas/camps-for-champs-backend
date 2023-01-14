import { Injectable } from "@nestjs/common";

import { User } from "../user/schema";
import { CampRepository } from "./camp.repository";

@Injectable()
export class CampService {
  constructor(private repository: CampRepository) {}

  async createCamp(user: User) {
    var camp = await this.repository.create({ user: user._id });
    return camp;
  }
}
