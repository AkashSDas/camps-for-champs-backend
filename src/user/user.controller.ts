import { Request } from "express";

// eslint-disable-next-line prettier/prettier
import { BadRequestException, Body, Controller, Get, Put, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { AddRoleDto } from "./dto";
import { UserService } from "./user.service";

@Controller("/v1/user")
export class UserController {
  constructor(private service: UserService) {}

  @Get("/me")
  @UseGuards(AuthGuard("jwt"))
  async me(@Req() req: Request) {
    return { user: req.user };
  }

  // ===============================
  // Roles
  // ===============================

  @Put("/:userId/role")
  @UseGuards(AuthGuard("jwt"))
  async addRole(@Body() dto: AddRoleDto, @Req() req) {
    try {
      var user = await this.service.addRole(req.user, dto.role);
    } catch (error) {
      if (error.message == "Role already exists") {
        throw new BadRequestException(error.message);
      }
      throw error;
    }

    return { user, message: "Role added" };
  }
}
