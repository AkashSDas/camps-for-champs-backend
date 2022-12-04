import { CampModule } from "src/camp/camp.module";
import { CampRepository } from "src/camp/camp.repository";
import { Camp, CampSchema } from "src/camp/schemas";

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { CampWishlistController } from "./camp-wishlist.controller";
import { CampWishlistRepository } from "./camp-wishlist.repository";
import { CampWishlistService } from "./camp-wishlist.service";
import { CampWishlist, CampWishlistSchema } from "./schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CampWishlist.name, schema: CampWishlistSchema },
      { name: Camp.name, schema: CampSchema },
    ]),
    CampModule,
  ],
  controllers: [CampWishlistController],
  providers: [CampWishlistService, CampWishlistRepository, CampRepository],
})
export class CampWishlistModule {}
