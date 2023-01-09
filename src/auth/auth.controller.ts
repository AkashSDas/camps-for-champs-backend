import { Response } from "express";

// eslint-disable-next-line prettier/prettier
import { BadRequestException, Body, Controller, InternalServerErrorException, Post, Res } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { EmailAndPasswordSignupDto } from "./dto";

@Controller("/v2/auth")
export class AuthController {
  constructor(private service: AuthService) {}

  // =====================================
  // Signup
  // =====================================

  @Post("email-signup")
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
      maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
    });

    return { user: result.user, accessToken: result.accessToken };
  }
}
