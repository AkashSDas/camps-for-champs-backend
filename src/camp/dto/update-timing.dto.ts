import { IsDateString, IsOptional } from "class-validator";

export class UpdateTimingDto {
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;
}
