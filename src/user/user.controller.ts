import { Request } from "express";
import { AccessTokenGuard } from "src/auth/guard";

import { Controller, Get, Req, UseGuards } from "@nestjs/common";

import { UserService } from "./user.service";

@Controller("/v2/user")
export class UserController {
  constructor(private service: UserService) {}

  @Get("/me")
  @UseGuards(AccessTokenGuard)
  async me(@Req() req: Request) {
    return { user: req.user };
  }
}
