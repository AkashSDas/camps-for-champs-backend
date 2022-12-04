import { Type } from "class-transformer";
// eslint-disable-next-line prettier/prettier
import { ArrayMinSize, IsArray, IsMongoId, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from "class-validator";
import { ActivityDto, TimeDto } from "src/camp/dto";

import { MemberDto } from "./member.dto";

export class BookACampDto {
  @IsString()
  @IsMongoId()
  readonly campId: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TimeDto)
  readonly checkInTime: TimeDto;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TimeDto)
  readonly checkOutTime: TimeDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityDto)
  readonly additionalActivities: ActivityDto[];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  readonly members: MemberDto[];

  @IsNumber()
  @Min(0)
  readonly amount: number;

  @IsNumber()
  @Min(1)
  readonly campUnit: number;
}
