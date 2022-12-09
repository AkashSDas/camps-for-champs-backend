import { createHash } from "crypto";
import { Request, Response } from "express";
import { User } from "src/user/schemas";
import { loginCookieConfig } from "src/utils/auth.util";

// eslint-disable-next-line prettier/prettier
import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UserRepository } from "../user/user.repository";
// eslint-disable-next-line prettier/prettier
import { sendForgotPasswordEmail, sendVerificationEmail } from "../utils/mail.util";
import { CompleteOAuthDto, SignupDto, VerifyEmailDto } from "./dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(private repository: UserRepository, private jwt: JwtService) {}

  // ================================
  // SIGNUP
  // ================================

  async signup(dto: SignupDto, res: Response) {
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

  async completeOAuth(userId: string, dto: CompleteOAuthDto, res: Response) {
    var user = await this.repository.findAndSet(
      { _id: userId },
      { email: dto.email },
    );
    if (!user) throw new NotFoundException("User not found");

    // Logging in the user
    var accessToken = user.accessToken(this.jwt);
    var refreshToken = user.refreshToken(this.jwt);
    res.cookie("refreshToken", refreshToken, loginCookieConfig);
    return { user, accessToken };
  }

  async socialSignup(user: User, res: Response) {
    // Checking for user for OAuth provider
    if (user) {
      let refreshToken = user.refreshToken(this.jwt);
      res.cookie("refreshToken", refreshToken, loginCookieConfig);
      return res.redirect(process.env.OAUTH_SIGNUP_SUCCESS_REDIRECT_URL);
    }

    return res.redirect(process.env.OAUTH_SIGNUP_FAILURE_REDIRECT_URL);
  }

  // ================================
  // LOGIN
  // ================================

  async login(dto: LoginDto, res: Response) {
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

  async accessToken(req: Request) {
    var refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new HttpException("No refresh token", HttpStatus.UNAUTHORIZED);
    }

    try {
      let decoded = this.jwt.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      if (!decoded) {
        throw new UnauthorizedException("Invalid or expired refresh token");
      }

      let user = await this.repository.getUser({ _id: decoded._id });
      if (!user) throw new NotFoundException("User not found");
      let accessToken = user.accessToken(this.jwt);
      return { user, accessToken };
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
  }

  async socialLogin(user: User, res: Response) {
    // Checking for user and required fields
    if (user && user.email) {
      let refreshToken = user.refreshToken(this.jwt);
      res.cookie("refreshToken", refreshToken, loginCookieConfig);
      return res.redirect(process.env.OAUTH_LOGIN_SUCCESS_REDIRECT_URL);
    }

    return res.redirect(
      `${process.env.OAUTH_LOGIN_FAILURE_REDIRECT_URL}?info=signup-invalid`,
    );
  }

  // ================================
  // EMAIL VERIFICATION
  // ================================

  async verifyEmail(dto: VerifyEmailDto) {
    var user = await this.repository.getUser({ email: dto.email });
    if (!user) throw new NotFoundException("User not found");
    if (user.verified) {
      throw new HttpException("Email already verified", HttpStatus.BAD_REQUEST);
    }

    var success = await sendVerificationEmail(user);
    if (!success) {
      throw new InternalServerErrorException("Failed to send email");
    }

    return { message: "Verification email sent" };
  }

  async confirmEmail(token: string) {
    var encryptedToken = createHash("sha256").update(token).digest("hex");
    var user = await this.repository.getUser({
      verificationToken: encryptedToken,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) throw new NotFoundException("User not found");

    user.active = true;
    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save({ validateModifiedOnly: true });

    return { message: "Email verified" };
  }

  // ================================
  // FORGOT PASSWORD
  // ================================

  async forgotPassword(email: string) {
    var user = await this.repository.getUser({ email });
    if (!user) throw new NotFoundException("User not found");

    var success = await sendForgotPasswordEmail(user);
    if (!success) {
      throw new InternalServerErrorException("Failed to send email");
    }

    return { message: "Password reset email sent" };
  }

  async passwordReset(token: string, password: string) {
    var encryptedToken = createHash("sha256").update(token).digest("hex");
    var user = await this.repository.getUser({
      passwordResetToken: encryptedToken,
      passwordResetTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) throw new NotFoundException("User not found");

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt = undefined;
    await user.save({ validateModifiedOnly: true });

    return { message: "Password reset" };
  }

  // ================================
  // OTHER
  // ================================

  logout(req: Request, res: Response) {
    if (req.cookies?.refreshToken) {
      res.clearCookie("refreshToken", loginCookieConfig);
    }

    return { message: "Logged out" };
  }
}
