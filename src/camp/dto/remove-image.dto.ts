import { IsOptional, IsString, IsUrl } from "class-validator";

export class RemoveImageDto {
  @IsUrl()
  @IsString()
  URL: string;

  @IsString()
  @IsOptional()
  id?: string;
}
