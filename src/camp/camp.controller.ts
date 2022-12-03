import { Request } from "express";
import { AccessTokenGuard } from "src/auth/guard";

import { Controller, Post, Req, UseGuards } from "@nestjs/common";

import { CampService } from "./camp.service";

@Controller("/v1/camp")
export class CampController {
  constructor(private service: CampService) {}

  // =============================
  // CAMP
  // =============================

  @Post("")
  @UseGuards(AccessTokenGuard)
  async createCamp(@Req() req: Request) {
    return await this.service.createCamp(req.user as any);
  }
}
