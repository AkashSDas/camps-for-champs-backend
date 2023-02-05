import { Booking, bookingSchema } from "./schema";
import { BookingController } from "./booking.controller";
import { BookingRepository } from "./booking.repository";
import { BookingService } from "./booking.service";
import { Camp, campSchema } from "src/camp/schema";
import { CampModule } from "../camp/camp.module";
import { CampRepository } from "../camp/camp.repository";
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ValidateBookingMiddleware } from "./middleware";
import { ValidateCampMiddleware } from "../camp/middleware";

@Module({
  imports: [
    CampModule,
    MongooseModule.forFeature([
      { name: Booking.name, schema: bookingSchema },
      { name: Camp.name, schema: campSchema },
    ]),
  ],
  providers: [BookingRepository, BookingService, CampRepository],
  controllers: [BookingController],
})
export class BookingModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateCampMiddleware).forRoutes({
      path: "v2/booking/camp/:campId*",
      method: RequestMethod.ALL,
    });

    // Not working
    consumer.apply(ValidateCampMiddleware).forRoutes({
      path: "v2/booking/status/:bookingId/camp/:campId*",
      method: RequestMethod.ALL,
    });

    consumer.apply(ValidateBookingMiddleware).forRoutes({
      path: "v2/booking/status/:bookingId",
      method: RequestMethod.ALL,
    });
  }
}
