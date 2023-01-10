import { Response } from "express";
import { User } from "src/user/schema";

// eslint-disable-next-line prettier/prettier
import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Post, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AuthService } from "./auth.service";
import { EmailAndPasswordLoginDto, EmailAndPasswordSignupDto } from "./dto";

@Controller("/v2/auth")
export class AuthController {
  constructor(private service: AuthService, private config: ConfigService) {}

  // =====================================
  // Signup
  // =====================================

  @Post("email-signup")
  @HttpCode(HttpStatus.CREATED)
  async emailAndPasswordSignup(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: EmailAndPasswordSignupDto,
  ) {
    var result = await this.service.emailAndPasswordSignup(dto);

    if (result.error instanceof Error) {
      let msg = result.error.message;
      if (msg == "User already exists") {
        throw new BadRequestException(msg);
      } else if (msg == "Failed to create user") {
        throw new InternalServerErrorException(msg);
      }
    }

    // Login user
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: Number(
        this.config.get("REFRESH_TOKEN_EXPIRES_IN").replace(/(m|h)/, ""),
      ),
    });

    return { user: result.user, accessToken: result.accessToken };
  }

  // GOOGLE

  @Get("google-signup")
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  initializeGoogleSignup() {}

  @Get("google-signup/redirect")
  async googleSignupRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    var refreshToken = this.service.oauthSignip(req.user as User);

    if (refreshToken) {
      return res.redirect(this.config.get("OAUTH_SIGNUP_SUCCESS_REDIRECT_URL"));
    }
    return res.redirect(this.config.get("OAUTH_SIGNUP_FAILURE_REDIRECT_URL"));
  }

  // =====================================
  // Login
  // =====================================

  @Post("email-login")
  @HttpCode(HttpStatus.OK)
  async emailAndPasswordLogin(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: EmailAndPasswordLoginDto,
  ) {
    var result = await this.service.emailAndPasswordLogin(dto);

    if (result.error instanceof Error) {
      let msg = result.error.message;
      if (msg == "User not found") {
        throw new NotFoundException("User doesn't exists");
      } else if (msg == "Wrong password") {
        throw new BadRequestException("Wrong password");
      }
    }

    // Login user
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: Number(
        this.config.get("REFRESH_TOKEN_EXPIRES_IN").replace(/(m|h)/, ""),
      ),
    });

    return { user: result.user, accessToken: result.accessToken };
  }
}
