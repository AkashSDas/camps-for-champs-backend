import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { AccessTokenGuard } from "src/auth/guard";
import { Roles } from "src/user/decorator";
import { RoleGuard } from "src/user/guard";
import { CAMP_IMG_DIR } from "src/utils/cloudinary.util";
import { UserRole } from "src/utils/user.util";

// eslint-disable-next-line prettier/prettier
import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";

import { CampService } from "./camp.service";
import { DetailsDto, ImageDto, LocationDto, ReorderCampImagesDto } from "./dto";
import { Camp, CampStatus } from "./schemas";

@Controller("/v2/camp")
export class CampController {
  constructor(private service: CampService) {}

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
    return await this.service.updateCampDetails(dto, res.locals.camp as Camp);
  }

  @Post("/:campId/image")
  @Roles(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  async addCampImage(
    @Body() dto: ImageDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    var camp: Camp = res.locals.camp;
    var image = req.files?.campImage as UploadedFile;
    if (!image) throw new BadRequestException("No image was uploaded");
    return await this.service.addCampImage(dto, camp, image);
  }

  @Delete("/:campId/image/:imageId")
  @Roles(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  async removeCampImage(
    @Param("imageId") id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    var camp: Camp = res.locals.camp;

    // Check if the image exists
    var image = camp.images.find(
      (image) => image.id == `${CAMP_IMG_DIR}/${camp._id}/${id}`,
    );
    if (!image) throw new NotFoundException("Image not found");

    await this.service.removeCampImage(id, camp);
    return { message: "Image deleted" };
  }

  @Put("/:campId/image")
  @Roles(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  async reorderCampImages(
    @Body() dto: ReorderCampImagesDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    var camp: Camp = res.locals.camp;
    camp = await this.service.reorderCampImages(dto.ids, camp);
    return { message: "Images reordered", camp };
  }

  @Put("/:campId/location")
  @Roles(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  async updateCampLocation(
    @Body() dto: LocationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    var camp: Camp = res.locals.camp;
    camp = await this.service.updateCampLocation(dto, camp);
    return { message: "Location updated", camp };
  }

  @Put("/:campId/publish")
  @Roles(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  async publishCamp(@Res({ passthrough: true }) res: Response) {
    var camp: Camp = res.locals.camp;
    camp = await this.service.publishCamp(camp);
    return { message: "Camp published", camp };
  }

  @Get("/:campId/info")
  getCamp(@Res({ passthrough: true }) res: Response) {
    return { camp: res.locals.camp };
  }

  @Get("")
  async getCamps() {
    var camps = await this.service.getCamps();
    return { camps };
  }

  @Get("/published")
  async getPublishedCamps() {
    var camps = await this.service.getCampsWithStatus(CampStatus.ACTIVE);
    return { camps };
  }

  @Delete("/:campId/remove")
  @Roles(UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  async deleteCamp(@Res({ passthrough: true }) res: Response) {
    var camp: Camp = res.locals.camp;
    await this.service.deleteCamp(camp);
    return { message: "Camp deleted" };
  }
}
