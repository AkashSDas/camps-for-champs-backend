import { AccessTokenGuard, RefreshTokenGuard } from "./guard";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { CreateOauthSession } from "./dto/create-oauth-session.dto";
import { hash } from "argon2";
import { InvalidOAuthLoginFilter } from "./filter";
import { Request, Response } from "express";
import { User } from "../user/schema";

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from "@nestjs/common";

import {
  CompleteOAuthSignupDto,
  EmailAndPasswordLoginDto,
  EmailAndPasswordSignupDto,
} from "./dto";

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

  @Put("complete-oauth-signup")
  @UseGuards(AccessTokenGuard)
  async completeOauthSignup(
    @Body() dto: CompleteOAuthSignupDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    var result = await this.service.completeOauthSignup(req.user as User, dto);
    if (result instanceof Error) throw new NotFoundException(result.message);

    // Login user
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: Number(this.config.get("REFRESH_TOKEN_EXPIRES_IN_MS")),
    });

    return { user: req.user, accessToken: result.accessToken };
  }

  @Delete("cancel-oauth-signup")
  @UseGuards(AccessTokenGuard)
  async cancelOauthSignup(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    var result = await this.service.cancelOauthSignup(req.user as User);
    if (result instanceof Error) throw new NotFoundException(result.message);

    // Remove cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: Number(this.config.get("REFRESH_TOKEN_EXPIRES_IN_MS")),
    });

    return { message: "Signup cancelled" };
  }

  // GOOGLE

  @Get("google-signup")
  @UseGuards(AuthGuard("google-signup"))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  initializeGoogleSignup() {}

  @Get("google-signup/redirect")
  @UseGuards(AuthGuard("google-signup"))
  async googleSignupRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    var refreshToken = this.service.oauthSignip((req as any).user as User);

    if (refreshToken) {
      // Login user
      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: "lax",
      //   maxAge: Number(this.config.get("REFRESH_TOKEN_EXPIRES_IN_MS")),
      // });

      // Incase of front-end having a different domain (which is in this case)
      // hashing the refresh token & then saving in the user doc & then
      // adding the hash in the redirect URL param.
      //
      // In the front-end make a call request to the back-end & if the hash
      // if valid then set refresh token in the cookie, clear it in the user
      // document & remove the param in the front-end. This will be new refresh token
      //
      // This is only for oauth signup, not for email/pwd auth.

      let token = await hash(refreshToken);
      ((req as any).user as User).sessionTokenDigest = token;
      await ((req as any).user as User).save();

      return res.redirect(
        this.config.get("OAUTH_SIGNUP_SUCCESS_REDIRECT_URL") +
          `?token=${encodeURIComponent(token)}`,
      );
    }

    return res.redirect(this.config.get("OAUTH_SIGNUP_FAILURE_REDIRECT_URL"));
  }

  @Post("oauth-session")
  @HttpCode(HttpStatus.OK)
  async createOauthSession(
    @Body() dto: CreateOauthSession,
    @Res({ passthrough: true }) res: Response,
  ) {
    var result = await this.service.createOauthSession(dto);
    if (result instanceof Error) throw new UnauthorizedException();

    // Login user
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: Number(this.config.get("REFRESH_TOKEN_EXPIRES_IN_MS")),
    });

    return { user: result.user, accessToken: result.accessToken };
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

  /**
   * This will only redirect to success url because if the user is not registered
   * then filter will handle the error and redirect to failure url
   */
  @Get("google-login/redirect")
  @UseGuards(AuthGuard("google-login"))
  @UseFilters(InvalidOAuthLoginFilter)
  async googleLoginRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    var refreshToken = this.service.oauthLogin((req as any).user as User);

    if (refreshToken) {
      let token = await hash(refreshToken);
      ((req as any).user as User).sessionTokenDigest = token;
      await ((req as any).user as User).save();

      return res.redirect(
        this.config.get("OAUTH_SIGNUP_SUCCESS_REDIRECT_URL") +
          `?token=${encodeURIComponent(token)}`,
      );
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
        maxAge: Number(this.config.get("REFRESH_TOKEN_EXPIRES_IN_MS")),
      });
    }

    if ((req as any).logOut) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      (req as any).logOut(function successfulOAuthLogout() {});
    }

    return { message: "Logged out successfully" };
  }
}
