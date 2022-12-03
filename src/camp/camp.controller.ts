import * as cloudinary from "cloudinary";
import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { AccessTokenGuard } from "src/auth/guard";
import { Roles } from "src/user/decorator";
import { RoleGuard } from "src/user/guard";
import { CAMP_IMG_DIR } from "src/utils/cloudinary.util";
import { UserRole } from "src/utils/user.util";

// eslint-disable-next-line prettier/prettier
import { BadRequestException, Body, Controller, Post, Put, Req, Res, UseGuards } from "@nestjs/common";

import { CampService } from "./camp.service";
import { DetailsDto, ImageDto } from "./dto";

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

  @Put("/:campId/image")
  @Roles(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  async updateCampImage(
    @Body() dto: ImageDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    var camp = res.locals.camp;
    var image = req.files?.campImage as UploadedFile;
    if (!image) throw new BadRequestException("No image was uploaded");
    try {
      var result = await cloudinary.v2.uploader.upload(image.tempFilePath, {
        folder: `${CAMP_IMG_DIR}/${camp._id}`,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }

    camp.images.push({
      URL: result.secure_url,
      id: result.public_id,
      type: dto.type,
      description: dto.description,
    });

    camp = await camp.save();

    return { camp, image: camp.images[camp.images.length - 1] };
  }
}
