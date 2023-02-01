import { GuestType } from "../schema";
import { IsEnum, IsNumber, Min } from "class-validator";

export class GuestDto {
  @IsEnum(GuestType)
  type: GuestType;

  @IsNumber()
  @Min(1)
  count: number;
}
