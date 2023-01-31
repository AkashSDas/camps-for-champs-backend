import { CampStatus } from "src/utils/camp";
import { IsEnum, IsString } from "class-validator";

export class UpdateStatusDto {
  @IsEnum(CampStatus)
  @IsString()
  status: CampStatus;
}
