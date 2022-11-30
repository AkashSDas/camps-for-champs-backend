import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
