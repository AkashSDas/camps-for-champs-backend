import { BookingService } from "./booking.service";
import { Controller } from "@nestjs/common";

@Controller("booking")
export class BookingController {
  constructor(private service: BookingService) {}
}
