import { CampRepository } from "src/camp/camp.repository";
import { User } from "src/user/schemas";

import { Injectable, NotFoundException } from "@nestjs/common";

import { CampBookingRepository } from "./camp-booking.repository";
import { BookACampDto } from "./dto";

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
}
