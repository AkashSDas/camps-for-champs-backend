import { SetMetadata } from "@nestjs/common";

import { UserRole } from "../../utils/user";

export function UseRole(role: UserRole) {
  return SetMetadata("role", role);
}
