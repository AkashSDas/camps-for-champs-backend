import { Response } from "express";
import { loginCookieConfig } from "src/utils/auth.util";

import { HttpException, HttpStatus, Injectable, Res } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UserRepository } from "../user/user.repository";
import { sendVerificationEmail } from "../utils/mail.util";
import { SignupDto } from "./dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(private repository: UserRepository, private jwt: JwtService) {}

  // ================================
  // SIGNUP
  // ================================

  async signup(dto: SignupDto, @Res() res: Response) {
    try {
      var user = await this.repository.createUser({
        email: dto.email,
        password: dto.password,
      });
      let success = await sendVerificationEmail(user);
      user.password = undefined; // remove password from response after email token is saved

      var message = success
        ? "Account created, verification email sent"
        : "Account created";

      var accessToken = user.accessToken(this.jwt);
      var refreshToken = user.refreshToken(this.jwt);
      res.cookie("refreshToken", refreshToken, loginCookieConfig);
    } catch (error) {
      if (error instanceof Error && error.message == "Email already exists") {
        throw new HttpException("Email already exists", HttpStatus.BAD_REQUEST);
      }
      throw error;
    }

    return { message, user, accessToken };
  }

  // ================================
  // LOGIN
  // ================================

  async login(dto: LoginDto, @Res() res: Response) {
    var user = await this.repository.getUserWithSelect(
      { email: dto.email },
      "+password",
    );
    if (!user) throw new NotFoundException("User not found");

    var isPasswordValid = await user.verifyPassword(dto.password);
    user.password = undefined; // remove password from response
    if (!isPasswordValid) {
      throw new HttpException("Invalid password", HttpStatus.BAD_REQUEST);
    }

    var accessToken = user.accessToken(this.jwt);
    var refreshToken = user.refreshToken(this.jwt);

    res.cookie("refreshToken", refreshToken, loginCookieConfig);
    return { user, accessToken };
  }
}
