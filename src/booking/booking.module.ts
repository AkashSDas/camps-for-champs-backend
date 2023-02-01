import { BookingRepository } from "./booking.repository";
import { Module } from "@nestjs/common";

@Module({
  providers: [BookingRepository],
})
export class BookingModule {}
