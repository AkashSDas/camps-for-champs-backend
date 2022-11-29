import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;
}
