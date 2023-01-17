import { Request } from "express";
import { AccessTokenGuard } from "src/auth/guard";
import { User } from "src/user/schema";

// eslint-disable-next-line prettier/prettier
import { BadRequestException, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, Post, Req, UseGuards } from "@nestjs/common";

import { WishlistService } from "./wishlist.service";

@Controller("/v2/wishlist")
export class WishlistController {
  constructor(private service: WishlistService) {}

  @Get("user/:userId")
  @UseGuards(AccessTokenGuard)
  async getWishlistForUser(@Req() req: Request) {
    var result = await this.service.getWishlistForUser((req.user as User)._id);
    if (!result) {
      throw new InternalServerErrorException("Failed to get wishlist for user");
    }

    return { wishlist: result };
  }

  @Post("camp/:campId")
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AccessTokenGuard)
  async createWishlistForUser(@Req() req: Request) {
    var result = await this.service.createWishlistForUser(
      (req.user as User)._id,
      req.params.campId,
    );

    if (result instanceof Error) throw new BadRequestException(result.message);
    return { wishlist: result };
  }
}
