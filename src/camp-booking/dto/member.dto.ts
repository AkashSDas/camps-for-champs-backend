import { IsEnum, IsNumber, IsString, Min } from "class-validator";

import { CampMemberType } from "../schema";

export class MemberDto {
  @IsEnum(CampMemberType)
  @IsString()
  readonly memberType: CampMemberType;

  @IsNumber()
  @Min(1)
  readonly amount: number;
}
