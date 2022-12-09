import { IsEmail, IsNotEmpty, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CompleteOAuthDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ type: String, example: "william@gmail" })
  email: string;
}
