import { Request, Response } from "express";

// eslint-disable-next-line prettier/prettier
import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";

import { AuthService } from "./auth.service";
// eslint-disable-next-line prettier/prettier
import { ForgotPasswordDto, PasswordResetDto, SignupDto, VerifyEmailDto } from "./dto";
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
  // EMAIL VERIFICATION
  // ================================

  @Post("/verify-email")
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return await this.service.verifyEmail(dto);
  }

  @Put("/confirm-email/:token")
  async confirmEmail(@Param("token") token: string) {
    return await this.service.confirmEmail(token);
  }

  // ================================
  // FORGOT PASSWORD
  // ================================

  @Post("/forgot-password")
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.service.forgotPassword(dto.email);
  }

  @Put("/password-reset/:token")
  async passwordReset(
    @Param("token") token: string,
    @Body() dto: PasswordResetDto,
  ) {
    if (dto.password !== dto.confirmPassword) {
      throw new HttpException("Passwords do not match", HttpStatus.BAD_REQUEST);
    }

    return await this.service.passwordReset(token, dto.password);
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
