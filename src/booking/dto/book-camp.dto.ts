import { GuestDto } from "./guest.dto";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

export class BookCampDto {
  @IsString()
  campId: string;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => GuestDto)
  guests: GuestDto[];

  @IsNumber()
  @Min(0)
  amountToCharge: number;

  @IsNumber()
  @Min(1)
  campUnitsBooked: number;
}
