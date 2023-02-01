import { AccessTokenGuard } from "../auth/guard";
import { BookCampDto } from "./dto";
import { BookingService } from "./booking.service";
import { Request } from "express";
import { User } from "../user/schema";
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

@Controller("/v2/booking")
export class BookingController {
  constructor(private service: BookingService) {}

  @Post("book-camp")
  @UseGuards(AccessTokenGuard)
  async bookCamp(@Body() dto: BookCampDto, @Req() req: Request) {
    if ((req.user as User).banned) {
      throw new BadRequestException("You are banned");
    }

    var result = await this.service.bookCamp(req.user as User, dto);
    if (result instanceof Error) throw result;
    return result;
  }
}
