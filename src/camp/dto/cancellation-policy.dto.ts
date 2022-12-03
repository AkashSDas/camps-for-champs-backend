import { IsEnum, IsString, Length } from "class-validator";

import { CancellationPolicyType } from "../schemas";

export class CancellationPolicyDto {
  @IsEnum(CancellationPolicyType)
  type: CancellationPolicyType;

  @IsString()
  @Length(0, 512)
  description: string;
}
