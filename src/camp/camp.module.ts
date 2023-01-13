import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { CampController } from "./camp.controller";
import { CampRepository } from "./camp.repository";
import { CampService } from "./camp.service";
import { Camp, campSchema } from "./schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Camp.name, schema: campSchema }]),
  ],
  controllers: [CampController],
  providers: [CampService, CampRepository],
})
export class CampModule {}
