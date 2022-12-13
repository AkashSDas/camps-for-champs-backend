import { Type } from "class-transformer";
// eslint-disable-next-line prettier/prettier
import { ArrayMaxSize, IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString, Length, Min, ValidateNested } from "class-validator";

import { Amenity, CampAccessibilityType } from "../schemas";
import { ActivityDto, CancellationPolicyDto, TimeDto } from "./";

export class DetailsDto {
  @IsString()
  @Length(0, 128)
  @IsOptional()
  name?: string;

  @IsString()
  @Length(0, 4096)
  @IsOptional()
  description?: string;

  @IsArray()
  @IsEnum(CampAccessibilityType, { each: true })
  @IsOptional()
  accessibilities?: CampAccessibilityType[];

  @IsArray()
  @IsEnum(Amenity, { each: true })
  @IsOptional()
  amenities?: Amenity[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityDto)
  @IsOptional()
  @ArrayMaxSize(12)
  activities?: ActivityDto[];

  @ValidateNested()
  @Type(() => TimeDto)
  @IsOptional()
  checkInTime?: TimeDto;

  @ValidateNested()
  @Type(() => TimeDto)
  @IsOptional()
  checkOutTime?: TimeDto;

  @ValidateNested()
  @Type(() => CancellationPolicyDto)
  @IsOptional()
  cancellationPolicy?: CancellationPolicyDto;

  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  campLimit?: number;
}
