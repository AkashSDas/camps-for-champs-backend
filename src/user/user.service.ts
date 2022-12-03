import { UserRole } from "src/utils/user.util";

import { Injectable } from "@nestjs/common";

import { User } from "./schemas";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  // ===============================
  // Roles
  // ===============================

  async addRole(user: User, role: UserRole) {
    // Check if the role exists
    if (user.roles.includes(role)) throw new Error("Role already exists");

    // Add the role
    return await this.repository.addRole(user, role);
  }
}
