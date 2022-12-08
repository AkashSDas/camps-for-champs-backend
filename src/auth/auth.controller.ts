import { Request, Response } from "express";

// eslint-disable-next-line prettier/prettier
import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
// eslint-disable-next-line prettier/prettier
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiHeaders, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";

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
  @ApiCreatedResponse({ description: "User created" })
  @ApiBadRequestResponse({ description: "Email already exists" })
  @ApiBody({ type: SignupDto, description: "Signup credentials" })
  @ApiTags("auth")
  async signup(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.service.signup(dto, res);
  }

  // GOOGLE

  @Get("/signup/google")
  @UseGuards(AuthGuard("google-signup"))
  @ApiOkResponse({ description: "User created OR logged in" })
  @ApiTags("auth")
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleSignup() {}

  @Get("/signup/google/redirect")
  @UseGuards(AuthGuard("google-signup"))
  @ApiOkResponse({
    description: "User signed up OR logged in is redirect to front-end",
  })
  @ApiTags("auth")
  async googleSignupRedirect(@Req() req: Request, @Res() res: Response) {
    var jwt = (req.user as any)?.jwt;
    if (jwt) {
      return res.redirect(process.env.OAUTH_SIGNUP_SUCCESS_REDIRECT_URL);
    } else {
      return res.redirect(process.env.OAUTH_SIGNUP_FAILURE_REDIRECT_URL);
    }
  }

  // ================================
  // LOGIN
  // ================================

  @Post("/login")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: "User logged in with access and refresh tokens",
  })
  @ApiBadRequestResponse({ description: "Invalid credentials" })
  @ApiBody({ type: LoginDto, description: "Login credentials" })
  @ApiTags("auth")
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.service.login(dto, res);
  }

  @Get("/access-token")
  @UseGuards(RefreshTokenGuard)
  @ApiOkResponse({ description: "Access token refreshed" })
  @ApiTags("auth")
  accessToken(@Req() req: Request) {
    return this.service.accessToken(req);
  }

  @Get("/login/google")
  @UseGuards(AuthGuard("google-login"))
  @ApiOkResponse({ description: "User logged in" })
  @ApiTags("auth")
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  loginWithGoogle() {}

  @Get("/login/google/redirect")
  @UseGuards(AuthGuard("google-login"))
  @ApiOkResponse({
    description: "User logged in is redirect to front-end",
  })
  @ApiTags("auth")
  loginWithGoogleRedirect(@Req() req: Request, @Res() res: Response) {
    var jwt = (req.user as any)?.jwt;

    if (jwt) {
      return res.redirect(process.env.OAUTH_LOGIN_SUCCESS_REDIRECT_URL);
    } else {
      return res.redirect(
        `${process.env.OAUTH_LOGIN_FAILURE_REDIRECT_URL}?info=signup-invalid`,
      );
    }
  }

  // ================================
  // EMAIL VERIFICATION
  // ================================

  @Post("/verify-email")
  @ApiOkResponse({ description: "Email verification sent" })
  @ApiBody({ type: VerifyEmailDto, description: "Verify email" })
  @ApiBadRequestResponse({ description: "Email not found" })
  @ApiBearerAuth("jwt")
  @ApiTags("auth")
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return await this.service.verifyEmail(dto);
  }

  @Put("/confirm-email/:token")
  @ApiResponse({ status: 302, description: "Redirect to login page" })
  @ApiBody({ type: PasswordResetDto, description: "Password reset" })
  @ApiBadRequestResponse({ description: "Invalid token" })
  @ApiBearerAuth("jwt")
  @ApiTags("auth")
  async confirmEmail(@Param("token") token: string) {
    return await this.service.confirmEmail(token);
  }

  // ================================
  // FORGOT PASSWORD
  // ================================

  @Post("/forgot-password")
  @ApiOkResponse({ description: "Password reset email sent" })
  @ApiBody({ type: ForgotPasswordDto, description: "Forgot password" })
  @ApiBadRequestResponse({ description: "Email not found" })
  @ApiBearerAuth("jwt")
  @ApiTags("auth")
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.service.forgotPassword(dto.email);
  }

  @Put("/password-reset/:token")
  @ApiOkResponse({ description: "Password reset" })
  @ApiHeaders([{ name: "Content-Type", description: "application/json" }])
  @ApiBearerAuth("jwt")
  @ApiBody({ type: PasswordResetDto, description: "Password reset" })
  @ApiBadRequestResponse({ description: "Passwords do not match" })
  @ApiTags("auth")
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
  @ApiOkResponse({ description: "User logged out" })
  @ApiBearerAuth("jwt")
  @ApiTags("auth")
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.service.logout(req, res);
  }

  // ================================
  // TEST
  // ================================

  @Get("/test")
  @ApiOkResponse({ description: "Test" })
  @ApiTags("auth")
  @UseGuards(AccessTokenGuard)
  test(@Req() req: Request) {
    return { user: req.user, message: "🌍 Secret operation" };
  }
}
