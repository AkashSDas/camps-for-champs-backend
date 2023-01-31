import { AccessTokenGuard } from "../auth/guard";
import { Camp } from "./schema";
import { CampService } from "./camp.service";
import { CampStatus } from "src/utils/camp";
import { Request, Response } from "express";
import { RoleGuard } from "../user/guard";
import { UploadedFile } from "express-fileupload";
import { User } from "../user/schema";
import { UseRole } from "../user/decorator";
import { UserRole } from "../utils/user";

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";

import {
  AddImageDto,
  RemoveImageDto,
  UpdateCancellationPolicyDto,
  UpdateLocationDto,
  UpdateSettingsDto,
  UpdateStatusDto,
  UpdateTimingDto,
} from "./dto";

// Using an alias for the route with public, since the ValidateCampMiddleware
// runs before on the route (:campId, but also on public), before the ordering
// precedence could take place. So having different route avoid to hit the middleware
// & then according to the ctrl ordering we hit the public route
@Controller(["/v2/camp", "/v2/public-camps"])
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

  @Delete(":campId")
  @UseRole(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AccessTokenGuard)
  async deleteCamp(@Res({ passthrough: true }) res: Response) {
    var result = await this.service.deleteCamp(res.locals.camp as any);
    if (result instanceof BadRequestException) throw result;
    return { camp: result };
  }

  @Get("public/:campId")
  async getPublicCamp(@Res({ passthrough: true }) res: Response) {
    var camp = res.locals.camp as Camp;

    if (camp.status == CampStatus.DRAFT) {
      throw new UnauthorizedException("Camp isn't public");
    } else if (camp.status == CampStatus.INACTIVE) {
      throw new BadRequestException("Camp is inactive");
    }

    return { camp };
  }

  @Get("public")
  async getPublicCamps() {
    var camps = await this.service.getPublicCamps();
    return { camps };
  }

  @Get(":campId")
  @UseRole(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AccessTokenGuard)
  async getCamp(@Res({ passthrough: true }) res: Response) {
    return { camp: res.locals.camp as Camp };
  }

  @Get("")
  @UseRole(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AccessTokenGuard)
  async getCamps() {
    var camps = await this.service.getCamps();
    return { camps };
  }

  // =====================================
  // UPDATE CAMP SETTINGS
  // =====================================

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
    var update = {};
    if (dto.startDate) update["startDate"] = new Date(dto.startDate);
    if (dto.endDate) update["endDate"] = new Date(dto.endDate);

    var result = await this.service.updateTiming(
      res.locals.camp as any,
      update,
    );
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

  @Put(":campId/status")
  @UseRole(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AccessTokenGuard)
  async updateStatus(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: UpdateStatusDto,
  ) {
    var result = await this.service.updateStatus(res.locals.camp as any, dto);
    if (!result) throw new NotFoundException("Camp not found");
    if (result instanceof BadRequestException) throw result;
    return { camp: result };
  }

  @Post(":campId/image")
  @HttpCode(HttpStatus.OK)
  @UseRole(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AccessTokenGuard)
  async addImage(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() dto: AddImageDto,
  ) {
    if (!req.files) {
      let result = await this.service.addImage(res.locals.camp as Camp, dto);

      if (result instanceof Error) {
        throw new BadRequestException(result.message);
      }

      return result;
    }

    var img = req.files.campImage as UploadedFile;
    if (req.files) {
      let result = await this.service.addImage(
        res.locals.camp as Camp,
        dto,
        img,
      );

      if (result instanceof Error) {
        if (result.message.includes("Failed")) {
          throw new InternalServerErrorException(result.message);
        }
        throw new BadRequestException(result.message);
      }

      return result;
    }
  }

  @Delete(":campId/image")
  @UseRole(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AccessTokenGuard)
  async removeImage(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RemoveImageDto,
  ) {
    var result = await this.service.removeImage(res.locals.camp as Camp, dto);
    return { camp: result };
  }
}
