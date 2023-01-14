// eslint-disable-next-line prettier/prettier
import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";

import { Accessibility, Amenity } from "../../utils/camp";

export class UpdateSettingsDto {
  @Length(0, 128)
  @IsString()
  @IsOptional()
  name?: string;

  @Length(0, 4096)
  @IsString()
  @IsOptional()
  about?: string;

  @IsEnum(Accessibility, { each: true })
  @IsArray()
  @IsOptional()
  accessibilities?: Accessibility[];

  @IsEnum(Amenity, { each: true })
  @IsArray()
  @IsOptional()
  amenities?: Amenity[];

  @Min(0)
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @IsOptional()
  price?: number;

  @Min(0)
  @IsInt()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsOptional()
  campLimit?: number;
}
