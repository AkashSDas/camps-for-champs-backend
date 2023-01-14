import { IsEnum, IsString, Length } from "class-validator";

import { PolicyType } from "../../utils/camp";

export class UpdateCancellationPolicyDto {
  @IsEnum(PolicyType)
  @IsString()
  type: PolicyType;

  @Length(0, 512)
  @IsString()
  description: string;
}
