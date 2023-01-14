import { IsLatLong, IsOptional, IsString, Length } from "class-validator";

export class UpdateLocationDto {
  @Length(0, 128)
  @IsString()
  @IsOptional()
  address?: string;

  @IsLatLong()
  @IsOptional()
  coordinates?: string;
}
