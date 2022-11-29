import { Response } from "express";
import { UserRepository } from "src/user/user.repository";
import { loginCookieConfig } from "src/utils/auth.util";

import { HttpException, HttpStatus, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { sendVerificationEmail } from "../utils/mail.util";
import { SignupDto } from "./dto";

export class AuthService {
  constructor(
    private config: ConfigService,
    private repository: UserRepository,
    private jwt: JwtService,
  ) {}

  // ================================
  // SIGNUP
  // ================================

  async signup(dto: SignupDto, @Res() res: Response) {
    {
      // Create new user and send verification email

      try {
        var user = await this.repository.createUser({
          email: dto.email,
          password: dto.password,
        });
        user.password = undefined; // remove password from response
        var success = await sendVerificationEmail(user);
        var message = success
          ? "Account created, verification email sent"
          : "Account created";
      } catch (error) {
        if (error instanceof Error && error.message == "Email already exists") {
          throw new HttpException(
            "Email already exists",
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }

    {
      // Login user
      let accessToken = user.accessToken();
      res.cookie("accessToken", accessToken, loginCookieConfig);
      return { accessToken, user, message };
    }
  }
}
