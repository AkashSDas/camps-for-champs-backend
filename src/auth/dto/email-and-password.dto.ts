// eslint-disable-next-line prettier/prettier
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class EmailAndPasswordSignupDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @Matches(
    /^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
    { message: "Password is weak" },
  )
  @Length(8, 20)
  @IsString()
  @IsNotEmpty()
  password: string;
}
