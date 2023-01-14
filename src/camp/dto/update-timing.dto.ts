import { IsDate, IsOptional } from "class-validator";

export class UpdateTimingDto {
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;
}
