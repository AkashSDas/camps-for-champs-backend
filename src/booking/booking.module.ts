import { BookingController } from "./booking.controller";
import { BookingRepository } from "./booking.repository";
import { BookingService } from "./booking.service";
import { CampModule } from "../camp/camp.module";
import { CampRepository } from "../camp/camp.repository";
import { Module } from "@nestjs/common";

@Module({
  imports: [CampModule],
  providers: [BookingRepository, BookingService, CampRepository],
  controllers: [BookingController],
})
export class BookingModule {}
