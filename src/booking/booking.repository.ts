import { Booking } from "./schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class BookingRepository {
  constructor(@InjectModel(Booking.name) private model: Model<Booking>) {}

  async create(data: Partial<Booking>) {
    return await this.model.create(data);
  }

  async save(booking: Booking) {
    return await booking.save();
  }
}
