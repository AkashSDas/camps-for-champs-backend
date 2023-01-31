import {
  IsLatLong,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from "class-validator";

export class UpdateLocationDto {
  @Length(0, 128)
  @IsString()
  @IsOptional()
  address?: string;

  @IsLatLong()
  @IsOptional()
  coordinates?: string;

  @IsUrl()
  @IsOptional()
  googleMapURL?: string;
}
