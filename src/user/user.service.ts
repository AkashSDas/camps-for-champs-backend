import { Injectable } from "@nestjs/common";
import { User } from "./schema";
import { UserRepository } from "./user.repository";
import { UserRole } from "src/utils/user";

@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  async addRole(user: User, role: UserRole) {
    user.roles.push(role);
    return await this.repository.save(user);
  }
}
