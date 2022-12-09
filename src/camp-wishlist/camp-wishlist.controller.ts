import { Request } from "express";
import { AccessTokenGuard } from "src/auth/guard";

import { Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";

import { CampWishlistService } from "./camp-wishlist.service";

@Controller("/v2/camp-wishlist")
export class CampWishlistController {
  constructor(private service: CampWishlistService) {}

  /**
   * @remark Camp is not checked whether it exists or not.
   */
  @UseGuards(AccessTokenGuard)
  @Post("/camp/:campId/wishlist")
  async toggleCampWishlistStatus(
    @Param("campId") campId: string,
    @Req() req: Request,
  ) {
    return this.service.toggleCampWishlistStatus((req.user as any)._id, campId);
  }

  @UseGuards(AccessTokenGuard)
  @Get("/user/:userId")
  async getUserWishlist(@Param("userId") userId: string) {
    return await this.service.getUserWishlist(userId);
  }
}
