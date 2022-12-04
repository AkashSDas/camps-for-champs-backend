import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { CampWishlistController } from "./camp-wishlist.controller";
import { CampWishlistService } from "./camp-wishlist.service";
import { CampWishlist, CampWishlistSchema } from "./schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CampWishlist.name, schema: CampWishlistSchema },
    ]),
  ],
  controllers: [CampWishlistController],
  providers: [CampWishlistService],
})
export class CampWishlistModule {}
