import { BookingRepository } from "../booking.repository";
import { Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class ValidateBookingMiddleware implements NestMiddleware {
  constructor(private repository: BookingRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    var booking = await this.repository.findOne({
      bookingId: req.params.bookingId,
    });

    if (!booking) throw new NotFoundException("Booking not found");
    res.locals.booking = booking;
    next();
  }
}
