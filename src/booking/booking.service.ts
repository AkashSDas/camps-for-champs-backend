import { BookingRepository } from "./booking.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BookingService {
  constructor(private repository: BookingRepository) {}
}
