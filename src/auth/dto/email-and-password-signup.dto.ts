import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class EmailAndPasswordSignupDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @Matches(/^(.*[a-z]{3,})$/, { message: "password must contain at least 3 lowercase letters" })
  @Matches(/^(.*[A-Z]{2,})$/, { message: "password must contain at least 2 uppercase letters" })
  @Matches(/^(.*[0-9]{2,})$/, { message: "password must contain at least 2 numbers" })
  @Matches(/^(.*[!@#$%^&*()\-__+.]{1,})$/, { message: "password must contain at least 1 special character" })
  @Length(8, 20)
  @IsString()
  @IsNotEmpty()
  password: string;
}
