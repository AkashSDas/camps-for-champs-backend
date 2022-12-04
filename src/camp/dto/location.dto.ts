// eslint-disable-next-line prettier/prettier
import { IsEnum, IsLatitude, IsLongitude, IsNumber, IsString, MaxLength } from "class-validator";

import { OperationalCity, OperationalState } from "../schemas";

export class LocationDto {
  @IsNumber()
  @IsLongitude()
  longitude: number;

  @IsNumber()
  @IsLatitude()
  latitude: number;

  @IsEnum(OperationalState)
  state: OperationalState;

  @IsEnum(OperationalCity)
  city: OperationalCity;

  @IsString()
  @MaxLength(512)
  address: string;
}
