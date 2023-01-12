import { Request, Response } from "express";

// eslint-disable-next-line prettier/prettier
import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";

import { User } from "../user/schema";
import { AuthService } from "./auth.service";
import { EmailAndPasswordLoginDto, EmailAndPasswordSignupDto } from "./dto";
import { AccessTokenGuard, RefreshTokenGuard } from "./guard";

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
      maxAge: Number(this.config.get("REFRESH_TOKEN_EXPIRES_IN_MS")),
    });

    return { user: result.user, accessToken: result.accessToken };
  }

  // GOOGLE

  @Get("google-signup")
  @UseGuards(AuthGuard("google-signup"))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  initializeGoogleSignup() {}

  @Get("google-signup/redirect")
  @UseGuards(AuthGuard("google-signup"))
  @HttpCode(HttpStatus.PERMANENT_REDIRECT)
  async googleSignupRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    var refreshToken = this.service.oauthSignip((req as any).user as User);

    if (refreshToken) {
      // Login user
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: Number(this.config.get("REFRESH_TOKEN_EXPIRES_IN_MS")),
      });

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
      maxAge: Number(this.config.get("REFRESH_TOKEN_EXPIRES_IN_MS")),
    });

    return { user: result.user, accessToken: result.accessToken };
  }

  @Get("access-token")
  @UseGuards(RefreshTokenGuard)
  async getNewAccessToken(@Req() req: Request) {
    var refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new UnauthorizedException("You're not logged in");

    var result = await this.service.getNewAccessToken(refreshToken);
    if (result instanceof Error) {
      if (result.message.includes("Invalid")) {
        throw new UnauthorizedException("You're not logged in");
      } else throw new NotFoundException("User not found");
    }

    return { user: result.user, accessToken: result.accessToken };
  }

  // GOOGLE

  @Get("google-login")
  @UseGuards(AuthGuard("google-login"))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  initializeGoogleLogin() {}

  @Get("google-login/redirect")
  @UseGuards(AuthGuard("google-login"))
  @HttpCode(HttpStatus.PERMANENT_REDIRECT)
  async googleLoginRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    var refreshToken = this.service.oauthLogin((req as any).user as User);

    if (refreshToken) {
      // Login user
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: Number(this.config.get("REFRESH_TOKEN_EXPIRES_IN_MS")),
      });

      return res.redirect(this.config.get("OAUTH_LOGIN_SUCCESS_REDIRECT_URL"));
    }

    return res.redirect(
      this.config.get("OAUTH_LOGIN_FAILURE_REDIRECT_URL") +
        "?info=invalid-signup",
    );
  }

  // =====================================
  // Others
  // =====================================

  @Post("logout")
  @UseGuards(AccessTokenGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if ((req as any).cookies?.refreshToken) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: Number(
          this.config.get("REFRESH_TOKEN_EXPIRES_IN").replace(/(m|h)/, ""),
        ),
      });
    }

    if ((req as any).logOut) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      (req as any).logOut(function successfulOAuthLogout() {});
    }

    return { message: "Logged out successfully" };
  }
}
