import { Controller } from "@nestjs/common";

import { UserService } from "./user.service";

@Controller("/v2/user")
export class UserController {
  constructor(private service: UserService) {}
}
