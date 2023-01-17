import { IsEnum, IsOptional, IsString, IsUrl, Length } from "class-validator";

import { ImageType } from "../schema";

export class AddImageDto {
  @IsEnum(ImageType)
  @IsString()
  type: ImageType;

  @IsUrl()
  @IsString()
  @IsOptional()
  URL?: string;

  @Length(0, 128)
  @IsString()
  @IsOptional()
  description?: string;
}
