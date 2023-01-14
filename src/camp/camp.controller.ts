import { Controller, Post, Req, UseGuards } from "@nestjs/common";

import { AccessTokenGuard } from "../auth/guard";
import { UseRole } from "../user/decorator";
import { RoleGuard } from "../user/guard/role.guard";
import { User } from "../user/schema";
import { UserRole } from "../utils/user";
import { CampService } from "./camp.service";

@Controller("/v2/camp")
export class CampController {
  constructor(private service: CampService) {}

  // https://stackoverflow.com/questions/68789602/guard-says-user-is-undefined-in-nestjs
  // When using two of the same decorators, the order, if I recall, is the lowest decorator
  // in the code first, then the highest one.
  @Post("")
  @UseRole(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AccessTokenGuard)
  async createCamp(@Req() req: Request) {
    var camp = await this.service.createCamp((req as any).user as User);
    return { camp };
  }
}
