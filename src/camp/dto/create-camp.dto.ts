// eslint-disable-next-line prettier/prettier
import { IsNotEmpty, IsObject, IsString, Length, ValidateNested } from "class-validator";

// eslint-disable-next-line prettier/prettier
import { CancellationPolicy, Location, Time } from "../schemas";

export class CreateCampDto {
  @IsNotEmpty()
  @IsString()
  @Length(12, 128)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(12, 1028)
  description: string;

  @IsNotEmpty()
  @ValidateNested()
  location: Location;

  @IsNotEmpty()
  @IsObject()
  checkInTime: Time;

  @IsNotEmpty()
  @IsObject()
  checkOutTime: Time;

  @IsNotEmpty()
  @IsObject()
  cancellationPolicy: CancellationPolicy;
}
