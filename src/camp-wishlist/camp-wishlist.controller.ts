import { Request } from "express";
import { AccessTokenGuard } from "src/auth/guard";

import { Controller, Param, Post, Req, UseGuards } from "@nestjs/common";

import { CampWishlistService } from "./camp-wishlist.service";

@Controller("/v1/camp-wishlist")
export class CampWishlistController {
  constructor(private service: CampWishlistService) {}

  /**
   * @remark Camp is not checked whether it exists or not.
   */
  @UseGuards(AccessTokenGuard)
  @Post(":campId/wishlist")
  async toggleCampWishlistStatus(
    @Param("campId") campId: string,
    @Req() req: Request,
  ) {
    return this.service.toggleCampWishlistStatus((req.user as any)._id, campId);
  }
}
