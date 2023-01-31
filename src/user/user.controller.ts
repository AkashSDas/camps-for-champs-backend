import { AccessTokenGuard } from "../auth/guard";
import { AddRoleDto } from "./dto";
import { capitalize } from "../utils";
import { Request } from "express";
import { User } from "./schema";
import { UserService } from "./user.service";

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";

@Controller("/v2/user")
export class UserController {
  constructor(private service: UserService) {}

  @Get("/me")
  @UseGuards(AccessTokenGuard)
  async me(@Req() req: Request) {
    return { user: req.user };
  }

  @Put("/role")
  @UseGuards(AccessTokenGuard)
  async addRole(@Req() req: Request, @Body() dto: AddRoleDto) {
    // Check if the role exists OR not
    if ((req.user as User).roles.includes(dto.role)) {
      throw new BadRequestException("User already has this role");
    }

    var user = await this.service.addRole(req.user as User, dto.role);
    return {
      user,
      message: `${capitalize(dto.role)} role is assigned`,
    };
  }
}
