import { IsEnum, IsInt, IsNumber, Max, Min } from "class-validator";

export class TimeDto {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsInt()
  @Min(0)
  @Max(24)
  hour: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsInt()
  @Min(0)
  @Max(60)
  minute: number;

  @IsEnum(["AM", "PM"])
  meridiem: string;
}
