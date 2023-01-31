import { AccessTokenGuard } from "src/auth/guard";
import { Request } from "express";
import { User } from "src/user/schema";
import { WishlistService } from "./wishlist.service";

import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

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

  @Delete("camp/:campId")
  @UseGuards(AccessTokenGuard)
  async removeWishtllistForUser(@Req() req: Request) {
    var result = await this.service.removeWishlistForUser(
      (req.user as User)._id,
      req.params.campId,
    );

    if (result instanceof Error) throw new BadRequestException(result.message);
    if (!result) throw new NotFoundException("Wishlist not found");
    return { wishlist: result };
  }
}
