import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { CampBookingController } from "./camp-booking.controller";
import { CampBookingRepository } from "./camp-booking.repository";
import { CampBookingService } from "./camp-booking.service";
import { CampBooking, CampBookingSchema } from "./schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CampBooking.name, schema: CampBookingSchema },
    ]),
  ],
  controllers: [CampBookingController],
  providers: [CampBookingService, CampBookingRepository],
})
export class CampBookingModule {}
