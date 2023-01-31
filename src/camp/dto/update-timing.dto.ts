import { IsDateString } from "class-validator";

export class UpdateTimingDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
