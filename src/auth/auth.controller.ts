import { Response } from "express";

import { Body, Controller, Post, Res } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { EmailAndPasswordSignupDto } from "./dto";

@Controller("/v2/auth")
export class AuthController {
  constructor(private service: AuthService) {}

  // =====================================
  // Signup
  // =====================================

  @Post("email-signup")
  emailAndPasswordSignup(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: EmailAndPasswordSignupDto,
  ) {
    return this.service.emailAndPasswordSignup(res, dto);
  }
}
