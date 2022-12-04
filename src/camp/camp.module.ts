// eslint-disable-next-line prettier/prettier
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { CampController } from "./camp.controller";
import { CampRepository } from "./camp.repository";
import { CampService } from "./camp.service";
import { CloudinaryProvider } from "./cloudinary.provider";
import { ValidateCampMiddleware } from "./middleware";
import { Camp, CampSchema } from "./schemas";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Camp.name, schema: CampSchema }]),
  ],
  controllers: [CampController],
  providers: [CampService, CampRepository, CloudinaryProvider],
  exports: [CampRepository],
})
export class CampModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateCampMiddleware).forRoutes({
      path: "v1/camp/:campId/*",
      method: RequestMethod.ALL,
    });
  }
}
