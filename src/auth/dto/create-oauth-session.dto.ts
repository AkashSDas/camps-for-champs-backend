import { IsNotEmpty, IsString } from "class-validator";

export class CreateOauthSession {
  @IsString()
  @IsNotEmpty()
  token: string;
}
