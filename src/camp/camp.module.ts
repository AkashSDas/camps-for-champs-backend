import { Camp, campSchema } from "./schema";
import { CampController } from "./camp.controller";
import { CampRepository } from "./camp.repository";
import { CampService } from "./camp.service";
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ValidateCampMiddleware } from "./middleware";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Camp.name, schema: campSchema }]),
  ],
  exports: [CampRepository],
  controllers: [CampController],
  providers: [CampService, CampRepository],
})
export class CampModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateCampMiddleware).forRoutes({
      path: "v2/camp/:campId*",
      method: RequestMethod.ALL,
    });
  }
}
