import { BookCampDto, UpdateBookingStatusDto } from "./dto";
import { Booking, BookingStatus, Guest } from "./schema";
import { BookingRepository } from "./booking.repository";
import { Camp } from "src/camp/schema";
import { CampRepository } from "../camp/camp.repository";
import { Types } from "mongoose";
import { User } from "../user/schema";
import { UserRole } from "src/utils/user";
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";

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
    var bookings = await this.repository.findUserBookings({ user: userId });
    return bookings;
  }

  async getCampBookings(campId: Types.ObjectId) {
    var bookings = await this.repository.findCampBookings({ camp: campId });
    return bookings;
  }

  async updateBookingStatus(
    booking: Booking,
    camp: Camp,
    dto: UpdateBookingStatusDto,
    userRoles: UserRole[],
  ) {
    var isAdmin = userRoles.includes(UserRole.ADMIN);
    var isStaff = userRoles.includes(UserRole.STAFF);
    if (isAdmin || isStaff) {
      // Update camp units limit
      if (
        dto.status == BookingStatus.FULFILLED ||
        dto.status == BookingStatus.CANCELLED
      ) {
        camp.campLimit = camp.campLimit + booking.campUnitsBooked;
        await camp.save({ validateModifiedOnly: true });
      }

      booking.status = dto.status;
      await booking.save({ validateModifiedOnly: true });
      return { booking };
    }

    return new ForbiddenException("You don't have that permission");
  }

  async checkActiveBooking(campId: string, user: User) {
    var camp = await this.campRepository.exists({ campId });
    if (!camp) return new Error("Camp not found");

    var booking = await this.repository.findOne({
      user: user._id,
      camp: camp._id,
      status: BookingStatus.PENDING,
      checkOut: { $gte: new Date(Date.now()) },
    });

    if (!booking) return null;
    return { booking };
  }
}
