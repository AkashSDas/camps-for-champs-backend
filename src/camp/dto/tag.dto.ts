import { IsArray, IsEnum, IsOptional, IsString, Length } from "class-validator";

import { TagCode } from "../schemas";

export class TagDto {
  @IsString()
  @Length(0, 16)
  @IsOptional()
  name: string;

  @IsString()
  @Length(0, 2)
  @IsOptional()
  emoji: string;

  @IsArray()
  @IsEnum(TagCode, { each: true })
  @IsOptional()
  codes: TagCode[];
}
