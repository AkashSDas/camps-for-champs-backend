import { Controller, Param, Post } from "@nestjs/common";

import { CampWishlistService } from "./camp-wishlist.service";

@Controller("/v1/camp-wishlist")
export class CampWishlistController {
  constructor(private service: CampWishlistService) {}

  @Post(":campId/user/:userId/wishlist")
  async createCampWishlist(
    @Param("campId") campId: string,
    @Param("userId") userId: string,
  ) {
    return this.service.createCampWishlist(campId, userId);
  }
}
