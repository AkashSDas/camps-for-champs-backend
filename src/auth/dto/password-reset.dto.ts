import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class PasswordResetDto {
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  @Matches(
    /^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
    { message: "password is weak" },
  )
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  @Matches(
    /^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
    { message: "password is weak" },
  )
  confirmPassword: string;
}
