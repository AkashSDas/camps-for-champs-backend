import { BadRequestException, Injectable } from "@nestjs/common";
import { BookCampDto } from "./dto";
import { BookingRepository } from "./booking.repository";
import { Camp } from "src/camp/schema";
import { CampRepository } from "../camp/camp.repository";
import { Guest } from "./schema";
import { Types } from "mongoose";
import { User } from "../user/schema";

@Injectable()
export class BookingService {
  constructor(
    private repository: BookingRepository,
    private campRepository: CampRepository,
  ) {}

  async bookCamp(user: User, camp: Camp, dto: BookCampDto) {
    // Check if the camp is already booked by the user
    var exists = await this.repository.findOne({
      user: user._id,
      camp: camp._id,
    });

    if (exists) {
      return new BadRequestException("You've already booked this camp");
    }

    // Create a booking
    var booking = await this.repository.create({
      user: user._id,
      camp: camp._id,
      checkIn: new Date(dto.checkIn),
      checkOut: new Date(dto.checkOut),
      guests: dto.guests as Guest[],
      amountCharged: Math.min(Math.max(dto.amountToCharge, 19), 99999999),
      campUnitsBooked: dto.campUnitsBooked,
    });

    // Update camp bookings & available units
    camp.bookings = camp.bookings + 1;
    camp.campLimit = camp.campLimit - dto.campUnitsBooked;
    await camp.save({ validateModifiedOnly: true });
    return { booking, camp };
  }

  async getUserBookings(userId: Types.ObjectId) {
    var bookings = await this.repository.find({ user: userId });
    return bookings;
  }

  async getCampBookings(campId: Types.ObjectId) {
    var bookings = await this.repository.find({ camp: campId });
    return bookings;
  }
}
