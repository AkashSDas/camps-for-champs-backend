import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

// To make our type do the validation, we need to use class-validator and class-transformer
// export interface SampleDto {
//   email: string;
//   password: number;
// }

export class SampleDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  password: number;
}
