import { Booking } from "./schema";
import { FilterQuery, Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class BookingRepository {
  constructor(@InjectModel(Booking.name) private model: Model<Booking>) { }

  async create(data: Partial<Booking>) {
    return await this.model.create(data);
  }

  async save(booking: Booking) {
    return await booking.save();
  }

  findCampBookings(filter: FilterQuery<Booking>) {
    return this.model.find(filter).populate("user", "email userId");
  }

  findOne(filter: FilterQuery<Booking>) {
    return this.model.findOne(filter);
  }

  findUserBookings(filter: FilterQuery<Booking>) {
    return this.model
      .find(filter)
      .populate("camp", "name images address campId location googleMapURL");
  }
}
