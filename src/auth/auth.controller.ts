import { Request, Response } from "express";
import { User } from "src/user/schemas";

// eslint-disable-next-line prettier/prettier
import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
// eslint-disable-next-line prettier/prettier
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiHeaders, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
// eslint-disable-next-line prettier/prettier
import { CompleteOAuthDto, ForgotPasswordDto, PasswordResetDto, SignupDto, VerifyEmailDto } from "./dto";
import { LoginDto } from "./dto/login.dto";
import { InvalidOAuthLoginFilter } from "./filter/invalid-oauth-signup.filter";
import { AccessTokenGuard, RefreshTokenGuard } from "./guard";

@Controller("/v2/auth")
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

  @Delete("/cancel-oauth")
  @UseGuards(AuthGuard("jwt"))
  @ApiOkResponse({ description: "OAuth cancelled" })
  @ApiTags("auth")
  async cancelOAuth(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    var user = req.user as User;
    return await this.service.cancelOAuth(user, req, res);
  }

  @Put("/complete-oauth")
  @UseGuards(AuthGuard("jwt"))
  async completeOAuth(
    @Body() dto: CompleteOAuthDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    var user = req.user as User;
    return await this.service.completeOAuth(user._id, dto, res);
  }

  // GOOGLE

  @Get("/signup/google")
  @UseGuards(AuthGuard("google-signup"))
  @ApiOkResponse({ description: "User created OR logged in" })
  @ApiTags("auth")
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  googleSignup() {}

  @Get("/signup/google/redirect")
  @UseGuards(AuthGuard("google-signup"))
  @ApiOkResponse({
    description: "User signed up OR logged in is redirect to front-end",
  })
  @ApiTags("auth")
  async googleSignupRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.service.socialSignup(req.user as User, res);
  }

  // Facebook

  @Get("/signup/facebook")
  @UseGuards(AuthGuard("facebook-signup"))
  @ApiOkResponse({ description: "User created OR logged in" })
  @ApiTags("auth")
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  facebookSignup() {}

  @Get("/signup/facebook/redirect")
  @UseGuards(AuthGuard("facebook-signup"))
  @ApiOkResponse({
    description: "User signed up OR logged in is redirect to front-end",
  })
  @ApiTags("auth")
  async facebookSignupRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.service.socialSignup(req.user as User, res);
  }

  // Twitter

  @Get("/signup/twitter")
  @UseGuards(AuthGuard("twitter-signup"))
  @ApiOkResponse({ description: "User created OR logged in" })
  @ApiTags("auth")
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  twitterSignup() {}

  @Get("/signup/twitter/redirect")
  @UseGuards(AuthGuard("twitter-signup"))
  @ApiOkResponse({
    description: "User signed up OR logged in is redirect to front-end",
  })
  @ApiTags("auth")
  async twitterSignupRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.service.socialSignup(req.user as User, res);
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

  // Google

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
  loginWithGoogleRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.service.socialLogin(req.user as User, res);
  }

  // Facebook

  @Get("/login/facebook")
  @UseGuards(AuthGuard("facebook-login"))
  @ApiOkResponse({ description: "User logged in" })
  @ApiTags("auth")
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  loginWithFacebook() {}

  @Get("/login/facebook/redirect")
  @UseGuards(AuthGuard("facebook-login"))
  @UseFilters(InvalidOAuthLoginFilter)
  @ApiOkResponse({
    description: "User logged in is redirect to front-end",
  })
  @ApiTags("auth")
  loginWithFacebookRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.service.socialLogin(req.user as User, res);
  }

  // Twitter

  @Get("/login/twitter")
  @UseGuards(AuthGuard("twitter-login"))
  @ApiOkResponse({ description: "User logged in" })
  @ApiTags("auth")
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  loginWithTwitter() {}

  @Get("/login/twitter/redirect")
  @UseGuards(AuthGuard("twitter-login"))
  @UseFilters(InvalidOAuthLoginFilter)
  @ApiOkResponse({
    description: "User logged in is redirect to front-end",
  })
  @ApiTags("auth")
  loginWithTwitterRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(req.user);
    return this.service.socialLogin(req.user as User, res);
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
  @ApiResponse({ status: 302, description: "Redirect to home page" })
  @ApiBody({ type: PasswordResetDto, description: "Password reset" })
  @ApiBadRequestResponse({ description: "Invalid token" })
  @ApiBearerAuth("jwt")
  @ApiTags("auth")
  async confirmEmail(
    @Param("token") token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.service.confirmEmail(token, res);
  }

  // ================================
  // FORGOT PASSWORD
  // ================================

  @Post("/forgot-password")
  @HttpCode(HttpStatus.OK)
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
