import { Types } from "mongoose";

// eslint-disable-next-line prettier/prettier
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { User } from "../user/schema/index";
import { UserRepository } from "../user/user.repository";
import { EmailAndPasswordLoginDto, EmailAndPasswordSignupDto } from "./dto";

type EmailAndPasswordLogin = {
  user?: User & { _id: Types.ObjectId };
  error?: Error;
  accessToken?: string;
  refreshToken?: string;
};

@Injectable()
export class AuthService {
  constructor(private repository: UserRepository, private jwt: JwtService) {}

  // =====================================
  // Signup
  // =====================================

  async emailAndPasswordSignup(dto: EmailAndPasswordSignupDto) {
    // Create user
    // Using arrow function to use AuthSerivce's this context
    var user: (User & { _id: Types.ObjectId }) | Error = await (async () => {
      try {
        let user = await this.repository.create({
          email: dto.email,
          passwordDigest: dto.password,
        });

        if (!user) return Error("Failed to create user");
        return user;
      } catch (error) {
        if (error instanceof Error) {
          let msg = error.message;
          if (msg == "Email already exists" || msg == "Duplicate fields") {
            return Error("User already exists");
          }
        }

        return Error("Failed to create user");
      }
    })();

    // Send result
    if (user instanceof Error) {
      return { user: null, error: user, accessToken: null, refreshToken: null };
    } else {
      let accessToken = user.getAccessToken(this.jwt);
      let refreshToken = user.getRefreshToken(this.jwt);
      user.passwordDigest = undefined; // rm password has from response
      return { user, accessToken, refreshToken, error: null };
    }
  }

  // =====================================
  // Login
  // =====================================

  async emailAndPasswordLogin(
    dto: EmailAndPasswordLoginDto,
  ): Promise<EmailAndPasswordLogin> {
    var user = await this.repository.getWithSelect(
      { email: dto.email },
      "+passwordDigest",
    );

    if (!user) return { error: Error("User not found") };

    {
      // Verify password
      let isPasswordValid = await user.verifyPassword(dto.password);
      user.passwordDigest = undefined; // rm password digest from response
      if (!isPasswordValid) return { user, error: Error("Wrong password") };
    }

    {
      // Login user
      let accessToken = user.getAccessToken(this.jwt);
      let refreshToken = user.getAccessToken(this.jwt);
      return { accessToken, refreshToken, user };
    }
  }
}
