import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CompleteOAuthSignupDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}
