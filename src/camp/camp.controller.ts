import { Request, Response } from "express";
import { AccessTokenGuard } from "src/auth/guard";
import { Roles } from "src/user/decorator";
import { RoleGuard } from "src/user/guard";
import { UserRole } from "src/utils/user.util";

// eslint-disable-next-line prettier/prettier
import { Body, Controller, Post, Put, Req, Res, UseGuards } from "@nestjs/common";

import { CampService } from "./camp.service";
import { DetailsDto } from "./dto";

@Controller("/v1/camp")
export class CampController {
  constructor(private service: CampService) {}

  // =============================
  // CAMP
  // =============================

  @Post("")
  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AccessTokenGuard)
  // https://stackoverflow.com/questions/68789602/guard-says-user-is-undefined-in-nestjs
  // When using two of the same decorators, the order, if I recall, is the lowest decorator
  // in the code first, then the highest one.
  async createCamp(@Req() req: Request) {
    return await this.service.createCamp(req.user as any);
  }

  @Put("/:campId/details")
  @Roles(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  async updateCampDetails(
    @Body() dto: DetailsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.service.updateCampDetails(dto, res.locals.camp);
  }
}
