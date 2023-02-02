import { BookingStatus } from "../schema";
import { IsEnum, IsString } from "class-validator";

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  @IsString()
  status: BookingStatus;
}
