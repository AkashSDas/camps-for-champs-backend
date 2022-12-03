import { IsEnum, IsNumber, Min } from "class-validator";

import { ActivityType } from "../schemas";

export class ActivityDto {
  @IsEnum(ActivityType)
  type: string;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  price: number;
}
