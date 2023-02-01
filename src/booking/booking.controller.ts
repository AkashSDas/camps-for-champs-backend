import { AccessTokenGuard } from "../auth/guard";
import { BookCampDto } from "./dto";
import { BookingService } from "./booking.service";
import { Camp } from "../camp/schema";
import { CampStatus } from "src/utils/camp";
import { Request, Response } from "express";
import { User } from "../user/schema";
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";

@Controller("/v2/booking")
export class BookingController {
  constructor(private service: BookingService) {}

  @Post("camp/:campId")
  @UseGuards(AccessTokenGuard)
  async bookCamp(
    @Body() dto: BookCampDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if ((req.user as User).banned) {
      throw new BadRequestException("You are banned");
    }

    var camp = res.locals.camp as Camp;
    if (camp.status != CampStatus.ACTIVE) {
      throw new BadRequestException("The camp is not available");
    } else if (camp.campLimit < dto.campUnitsBooked) {
      throw new BadRequestException("The camp is fully booked");
    }

    // Check if the check in & check out dates are valid
    var dates: any = {};
    dates["checkInDate"] = new Date(dto.checkIn);
    dates["checkOutDate"] = new Date(dto.checkOut);

    if (dates.checkInDate > dates.checkOutDate) {
      return new BadRequestException("Invalid check in & check out dates");
    } else if (dates.checkInDate < new Date(Date.now())) {
      return new BadRequestException("Invalid check in date");
    } else if (dates.checkOutDate < new Date(Date.now())) {
      return new BadRequestException("Invalid check out date");
    } else if (
      dates.checkInDate < camp.startDate ||
      dates.checkInDate > camp.endDate
    ) {
      return new BadRequestException("Invalid check in date");
    } else if (
      dates.checkOutDate < camp.startDate ||
      dates.checkOutDate > camp.endDate
    ) {
      return new BadRequestException("Invalid check out date");
    }

    var result = await this.service.bookCamp(req.user as User, camp, dto);
    if (result instanceof Error) throw result;
    return result;
  }
}
