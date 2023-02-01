import { BadRequestException, Injectable } from "@nestjs/common";
import { BookCampDto } from "./dto";
import { BookingRepository } from "./booking.repository";
import { Camp } from "src/camp/schema";
import { CampRepository } from "../camp/camp.repository";
import { Guest } from "./schema";
import { User } from "../user/schema";

@Injectable()
export class BookingService {
  constructor(
    private repository: BookingRepository,
    private campRepository: CampRepository,
  ) {}

  async bookCamp(user: User, camp: Camp, dto: BookCampDto) {
    // Check if the camp is already booked by the user
    var exists = await this.repository.find({
      user: user._id,
      camp: dto.campId,
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
    var updatedCamp = await this.campRepository.findAndSet(
      { campId: dto.campId },
      {
        bookings: camp.bookings + 1,
        campLimit: camp.campLimit - dto.campUnitsBooked,
      },
    );

    return { booking, updatedCamp };
  }
}
