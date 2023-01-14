import { Response } from "express";

// eslint-disable-next-line prettier/prettier
import { Body, Controller, NotFoundException, Post, Put, Req, Res, UseGuards } from "@nestjs/common";

import { AccessTokenGuard } from "../auth/guard";
import { UseRole } from "../user/decorator";
import { RoleGuard } from "../user/guard/role.guard";
import { User } from "../user/schema";
import { UserRole } from "../utils/user";
import { CampService } from "./camp.service";
// eslint-disable-next-line prettier/prettier
import { UpdateCancellationPolicyDto, UpdateLocationDto, UpdateSettingsDto, UpdateTimingDto } from "./dto";

@Controller("/v2/camp")
export class CampController {
  constructor(private service: CampService) {}

  // https://stackoverflow.com/questions/68789602/guard-says-user-is-undefined-in-nestjs
  // When using two of the same decorators, the order, if I recall, is the lowest decorator
  // in the code first, then the highest one.
  @Post("")
  @UseRole(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AccessTokenGuard)
  async createCamp(@Req() req: Request) {
    var camp = await this.service.createCamp((req as any).user as User);
    return { camp };
  }

  @Put(":campId/settings")
  @UseRole(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AccessTokenGuard)
  async updateSettings(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: UpdateSettingsDto,
  ) {
    var result = await this.service.updateSettings(res.locals.camp as any, dto);
    if (!result) throw new NotFoundException("Camp not found");
    return { camp: result };
  }

  @Put(":campId/timing")
  @UseRole(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AccessTokenGuard)
  async updateTiming(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: UpdateTimingDto,
  ) {
    var result = await this.service.updateTiming(res.locals.camp as any, dto);
    if (!result) throw new NotFoundException("Camp not found");
    return { camp: result };
  }

  @Put(":campId/location")
  @UseRole(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AccessTokenGuard)
  async updateLocation(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: UpdateLocationDto,
  ) {
    var result = await this.service.updateLocation(res.locals.camp as any, dto);
    if (!result) throw new NotFoundException("Camp not found");
    return { camp: result };
  }

  @Put(":campId/cancellation-policy")
  @UseRole(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AccessTokenGuard)
  async updateCancellationPolicy(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: UpdateCancellationPolicyDto,
  ) {
    var result = await this.service.updateCancellationPolicy(
      res.locals.camp as any,
      dto,
    );

    if (!result) throw new NotFoundException("Camp not found");
    return { camp: result };
  }
}
