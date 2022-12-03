import { Model } from "mongoose";
import { User } from "src/user/schemas";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { DetailsDto } from "./dto";
import { Camp } from "./schemas";

@Injectable()
export class CampRepository {
  constructor(@InjectModel(Camp.name) private camp: Model<Camp>) {}

  // =============================
  // CAMP
  // =============================

  async createCamp(user: User) {
    return await this.camp.create({ user: user._id });
  }

  getCamp(campId: string) {
    return this.camp.findById(campId);
  }

  updateCampDetails(dto: DetailsDto, camp: Camp) {
    return this.camp.findByIdAndUpdate(
      camp._id,
      { $set: { ...dto } },
      { new: true },
    );
  }
}