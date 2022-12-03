import { UserRole } from "src/utils/user.util";

import { SetMetadata } from "@nestjs/common";

export function Roles(role: UserRole) {
  return SetMetadata("role", role);
}
