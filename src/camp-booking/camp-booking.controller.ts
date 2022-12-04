import { Request } from "express";

// eslint-disable-next-line prettier/prettier
import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { CampBookingService } from "./camp-booking.service";
import { BookACampDto } from "./dto";

@Controller("/v1/camp-booking")
export class CampBookingController {
  constructor(private service: CampBookingService) {}

  /**
   * @remark This controller explicitly checks whether the camp exists or not.
   */
  @Post("")
  @UseGuards(AuthGuard("jwt"))
  async bookACamp(@Body() dto: BookACampDto, @Req() req: Request) {
    var booking = await this.service.bookACamp(dto, req.user as any);
    return { booking };
  }

  @Get("")
  @UseGuards(AuthGuard("jwt"))
  async getAllBookingsForUser(@Req() req: Request) {
    var bookings = await this.service.getAllBookingsForUser(
      (req.user as any)._id,
    );

    return { bookings };
  }

  @Delete("/:bookingId")
  @UseGuards(AuthGuard("jwt"))
  async cancelBooking(@Param("bookingId") id) {
    var booking = await this.service.cancelBooking(id);
    return { booking };
  }
}
