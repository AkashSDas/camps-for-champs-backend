import { Request, Response } from "express";

// eslint-disable-next-line prettier/prettier
import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { SignupDto } from "./dto";
import { LoginDto } from "./dto/login.dto";
import { AccessTokenGuard, RefreshTokenGuard } from "./guard";

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

  // ================================
  // LOGIN
  // ================================

  @Post("/login")
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.service.login(dto, res);
  }

  @Get("/access-token")
  @UseGuards(RefreshTokenGuard)
  accessToken(@Req() req: Request) {
    return this.service.accessToken(req);
  }

  // ================================
  // OTHER
  // ================================

  @Get("/logout")
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.service.logout(req, res);
  }

  // ================================
  // TEST
  // ================================

  @Get("/test")
  @UseGuards(AccessTokenGuard)
  test(@Req() req: Request) {
    return { user: req.user, message: "🌍 Secret operation" };
  }
}
