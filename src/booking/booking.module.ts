import { BookingController } from "./booking.controller";
import { BookingRepository } from "./booking.repository";
import { BookingService } from "./booking.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [BookingRepository, BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
