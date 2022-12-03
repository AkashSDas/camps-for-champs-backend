import { IsEnum, IsOptional, IsString, Length } from "class-validator";

import { CampImageType } from "../schemas";

export class ImageDto {
  @IsString()
  @IsEnum(CampImageType)
  type: CampImageType;

  @IsString()
  @Length(0, 128)
  @IsOptional()
  description?: string;
}
