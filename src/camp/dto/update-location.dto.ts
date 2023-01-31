import {
  IsLatLong,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
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
  @Matches(/https:\/\/goo.gl\/maps\/.+/, {
    message: "Invalid Google Map URL",
  })
  googleMapURL?: string;
}
