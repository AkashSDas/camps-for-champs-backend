// eslint-disable-next-line prettier/prettier
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

// eslint-disable-next-line prettier/prettier
import { ApiProperty } from "@nestjs/swagger";

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ type: String, example: "william@gmail.com" })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  @Matches(
    /^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
    { message: "password is weak" },
  )
  @ApiProperty({ type: String, example: "testingTEST123@" })
  password: string;
}
