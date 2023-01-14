import { IsEnum, IsString } from "class-validator";
import { CampStatus } from "src/utils/camp";

export class UpdateStatusDto {
  @IsEnum(CampStatus)
  @IsString()
  status: CampStatus;
}
