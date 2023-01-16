// eslint-disable-next-line prettier/prettier
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { CampController } from "./camp.controller";
import { CampRepository } from "./camp.repository";
import { CampService } from "./camp.service";
import { ValidateCampMiddleware } from "./middleware";
import { Camp, campSchema } from "./schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Camp.name, schema: campSchema }]),
  ],
  controllers: [CampController],
  providers: [CampService, CampRepository],
})
export class CampModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateCampMiddleware).forRoutes({
      path: "v2/camp/:campId",
      method: RequestMethod.ALL,
    });
  }
}
