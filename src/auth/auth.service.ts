import { Response } from "express";
import { UserRepository } from "src/user/user.repository";

// eslint-disable-next-line prettier/prettier
import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { EmailAndPasswordSignupDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(private repository: UserRepository, private jwt: JwtService) {}

  // =====================================
  // Signup
  // =====================================

  async emailAndPasswordSignup(res: Response, dto: EmailAndPasswordSignupDto) {
    // Create user
    try {
      var user = await this.repository.create({
        email: dto.email,
        passwordDigest: dto.password,
      });

      if (!user) {
        throw new InternalServerErrorException("Failed to create user");
      }
    } catch (error) {
      if (error instanceof Error) {
        let msg = error.message;
        if (msg == "Email already exists" || msg == "Duplicate fields") {
          throw new BadRequestException("User already exists");
        }
      }

      throw new InternalServerErrorException("Failed to create user");
    }

    // Login user
    {
      let accessToken = user.getAccessToken(this.jwt);
      let refreshToken = user.getRefreshToken(this.jwt);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
      });

      user.passwordDigest = undefined; // rm password has from response
      return { user, accessToken, message: "Account created successfully" };
    }
  }
}
