import { BookingController } from "./booking.controller";
import { BookingRepository } from "./booking.repository";
import { BookingService } from "./booking.service";
import { CampModule } from "../camp/camp.module";
import { CampRepository } from "../camp/camp.repository";
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ValidateCampMiddleware } from "src/camp/middleware";

@Module({
  imports: [CampModule],
  providers: [BookingRepository, BookingService, CampRepository],
  controllers: [BookingController],
})
export class BookingModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateCampMiddleware).forRoutes({
      path: "v2/booking/camp/:campId*",
      method: RequestMethod.ALL,
    });
  }
}
