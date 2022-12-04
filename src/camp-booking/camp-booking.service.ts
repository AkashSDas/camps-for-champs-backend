import { CampRepository } from "src/camp/camp.repository";
import { User } from "src/user/schemas";

import { Injectable, NotFoundException } from "@nestjs/common";

import { CampBookingRepository } from "./camp-booking.repository";
import { BookACampDto } from "./dto";
import { CampBookingStatus } from "./schema";

@Injectable()
export class CampBookingService {
  constructor(
    private campBookingRepository: CampBookingRepository,
    private campRepository: CampRepository,
  ) {}

  async bookACamp(dto: BookACampDto, user: User) {
    var camp = await this.campRepository.getCamp(dto.campId);
    if (!camp) throw new NotFoundException("Camp does not exist");

    var booking = await this.campBookingRepository.create(dto, camp, user);
    return booking;
  }

  async getAllBookingsForUser(userId: string) {
    return this.campBookingRepository.getAllForUser(userId);
  }

  async cancelBooking(bookingId: string) {
    // Check if the booking exists
    var booking = await this.campBookingRepository.exists({
      _id: bookingId,
      status: CampBookingStatus.PENDING,
    });
    if (!booking) throw new NotFoundException("Booking does not exist");

    // Cancel booking
    var updatedBooking = await this.campBookingRepository.update(
      { _id: bookingId },
      { $set: { status: CampBookingStatus.CANCELLED } },
    );

    return updatedBooking;
  }
}
