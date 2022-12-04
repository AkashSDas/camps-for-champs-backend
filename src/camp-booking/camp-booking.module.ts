import { CampModule } from "src/camp/camp.module";
import { CampRepository } from "src/camp/camp.repository";
import { Camp, CampSchema } from "src/camp/schemas";

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
      { name: Camp.name, schema: CampSchema },
    ]),
    CampModule,
  ],
  controllers: [CampBookingController],
  providers: [CampBookingService, CampBookingRepository, CampRepository],
})
export class CampBookingModule {}
