import { BadRequestException, Injectable } from "@nestjs/common";
import { BookCampDto } from "./dto";
import { BookingRepository } from "./booking.repository";
import { CampRepository } from "../camp/camp.repository";
import { CampStatus } from "src/utils/camp";
import { Guest } from "./schema";
import { User } from "../user/schema";

@Injectable()
export class BookingService {
  constructor(
    private repository: BookingRepository,
    private campRepository: CampRepository,
  ) {}

  async bookCamp(user: User, dto: BookCampDto) {
    // Check if the camp is already booked by the user
    {
      let exists = await this.repository.find({
        user: user._id,
        camp: dto.campId,
      });

      if (exists) {
        return new BadRequestException("You've already booked this camp");
      }
    }

    // Check if the camp exist & is available
    var camp = await this.campRepository.findOne({
      campId: dto.campId,
      status: CampStatus.ACTIVE,
    });

    if (!camp) {
      return new BadRequestException(
        "The camp doesn't exist or is not available",
      );
    }

    if (camp.campLimit < dto.campUnitsBooked) {
      return new BadRequestException("The camp is fully booked");
    }

    // Check if the check in & check out dates are valid
    var dates: any = {};
    dates["checkInDate"] = new Date(dto.checkIn);
    dates["checkOutDate"] = new Date(dto.checkOut);

    if (dates.checkInDate > dates.checkOutDate) {
      return new BadRequestException("Invalid check in & check out dates");
    } else if (dates.checkInDate < new Date(Date.now())) {
      return new BadRequestException("Invalid check in date");
    } else if (dates.checkOutDate < new Date(Date.now())) {
      return new BadRequestException("Invalid check out date");
    } else if (
      dates.checkInDate < camp.startDate ||
      dates.checkInDate > camp.endDate
    ) {
      return new BadRequestException("Invalid check in date");
    } else if (
      dates.checkOutDate < camp.startDate ||
      dates.checkOutDate > camp.endDate
    ) {
      return new BadRequestException("Invalid check out date");
    }

    // Create a booking
    var booking = await this.repository.create({
      user: user._id,
      camp: camp._id,
      checkIn: dates.checkInDate,
      checkOut: dates.checkOutDate,
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
