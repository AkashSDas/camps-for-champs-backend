import { Request } from "express";

import { Controller, Get, Req, UseGuards } from "@nestjs/common";

import { AccessTokenGuard } from "../auth/guard";
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
