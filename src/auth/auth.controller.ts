import { Response } from "express";

import { Body, Controller, Post, Res } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { SignupDto } from "./dto";

@Controller("/v1/auth")
export class AuthController {
  constructor(private service: AuthService) {}

  // ================================
  // SIGNUP
  // ================================

  @Post("/signup")
  async signup(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.service.signup(dto, res);
  }
}
