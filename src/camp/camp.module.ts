import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { CampController } from "./camp.controller";
import { CampRepository } from "./camp.repository";
import { CampService } from "./camp.service";
import { Camp, CampSchema } from "./schemas";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Camp.name, schema: CampSchema }]),
  ],
  controllers: [CampController],
  providers: [CampService, CampRepository],
})
export class CampModule {}
