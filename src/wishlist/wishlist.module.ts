import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { wishlistSchema } from "./schema";
import { WishlistController } from "./wishlist.controller";
import { WishlistRepository } from "./wishlist.repository";
import { WishlistService } from "./wishlist.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Wishlist", schema: wishlistSchema }]),
  ],
  controllers: [WishlistController],
  providers: [WishlistService, WishlistRepository],
})
export class WishlistModule {}
