import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class EmailAndPasswordSignupDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @Length(8, 20)
  @IsString()
  @IsNotEmpty()
  password: string;
}
