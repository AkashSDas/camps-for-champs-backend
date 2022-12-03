import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UserRole } from "src/utils/user.util";

export class AddRoleDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
