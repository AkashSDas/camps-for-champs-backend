import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UserRole } from "../../utils/user";

export class AddRoleDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
