import { Model } from "mongoose";
import { Camp } from "src/camp/schemas";
import { User } from "src/user/schemas";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { BookACampDto } from "./dto";
import { CampBooking } from "./schema";

@Injectable()
export class CampBookingRepository {
  constructor(
    @InjectModel(CampBooking.name) private model: Model<CampBooking>,
  ) {}

  async create(dto: BookACampDto, camp: Camp, user: User) {
    return await this.model.create({
      user: user._id,
      camp: dto.campId,
      checkInTime: dto.checkInTime,
      checkOutTime: dto.checkOutTime,
      activities: [
        ...camp.activities.filter((c) => c.price == 0), // adding all free activities
        ...dto.additionalActivities, // additing additional activities if any provided (paid activities)
      ],
      members: dto.members,
      amount: dto.amount,
      campUnit: dto.campUnit,
    });
  }

  async getAllForUser(userId: string) {
    return this.model.find({ user: userId }).populate("camp");
  }
}
