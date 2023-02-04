import { AccessTokenGuard } from "../auth/guard";
import { BookCampDto, UpdateBookingStatusDto } from "./dto";
import { Booking } from "./schema";
import { BookingService } from "./booking.service";
import { Camp } from "../camp/schema";
import { CampStatus } from "src/utils/camp";
import { Request, Response } from "express";
import { RoleGuard } from "src/user/guard";
import { User } from "../user/schema";
import { UseRole } from "src/user/decorator";
import { UserRole } from "src/utils/user";
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
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
    @Res({ passthrough: true }) res: Response,
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
      throw new BadRequestException("Invalid check in & check out dates");
    } else if (dates.checkInDate < new Date(Date.now())) {
      throw new BadRequestException("Invalid check in date");
    } else if (dates.checkOutDate < new Date(Date.now())) {
      throw new BadRequestException("Invalid check out date");
    } else if (
      dates.checkInDate < camp.startDate ||
      dates.checkInDate > camp.endDate
    ) {
      throw new BadRequestException("Invalid check in date");
    } else if (
      dates.checkOutDate < camp.startDate ||
      dates.checkOutDate > camp.endDate
    ) {
      throw new BadRequestException("Invalid check out date");
    }

    var result = await this.service.bookCamp(req.user as User, camp, dto);
    if (result instanceof Error) throw result;
    return result;
  }

  @Get("user")
  @UseGuards(AccessTokenGuard)
  async getUserBookings(@Req() req: Request) {
    var bookings = await this.service.getUserBookings((req.user as User)._id);
    return { bookings };
  }

  @Get("camp/:campId")
  @UseRole(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AccessTokenGuard)
  async getCampBookings(@Res({ passthrough: true }) res: Response) {
    var bookings = await this.service.getCampBookings(
      (res.locals.camp as Camp)._id,
    );
    return { bookings };
  }

  @Put("status/:bookingId/camp/campId")
  @UseGuards(AccessTokenGuard)
  async updateBookingStatus(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    var booking = res.locals.booking as Booking;
    var user = req.user as User;
    var camp = res.locals.camp as Camp;

    if (camp.status != CampStatus.ACTIVE) {
      throw new BadRequestException("The camp is not available");
    }

    var result = await this.service.updateBookingStatus(
      booking,
      camp,
      dto,
      user.roles,
    );
    if (result instanceof Error) throw result;
    return result;
  }

  @Get("user/:campId")
  @UseGuards(AccessTokenGuard)
  async checkActiveBooking(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    var booking = await this.service.checkActiveBooking(
      req.params.campId,
      (res.locals.user as User)._id,
    );
    return { booking };
  }
}
