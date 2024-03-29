import { CreateOauthSession } from "./dto/create-oauth-session.dto";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Types } from "mongoose";
import { User } from "../user/schema/index";
import { UserRepository } from "../user/user.repository";

import {
  CompleteOAuthSignupDto,
  EmailAndPasswordLoginDto,
  EmailAndPasswordSignupDto,
} from "./dto";

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

  async completeOauthSignup(user: User, dto: CompleteOAuthSignupDto) {
    var updatedUser = await this.repository.update(
      { _id: user._id },
      { email: dto.email },
    );
    if (!updatedUser) return new Error("User not found");

    var accessToken = user.getAccessToken(this.jwt);
    var refreshToken = user.getRefreshToken(this.jwt);
    return { accessToken, refreshToken };
  }

  async cancelOauthSignup(user: User) {
    var deletedUser = await this.repository.delete({ _id: user._id });
    if (!deletedUser) return new Error("User not found");
    return true;
  }

  oauthSignip(user?: User): string | undefined {
    if (user) {
      let refreshToken = user.getRefreshToken(this.jwt);
      return refreshToken;
    }
  }

  async createOauthSession(dto: CreateOauthSession) {
    var user = await this.repository.getWithSelect(
      { sessionTokenDigest: decodeURIComponent(dto.token) },
      "+sessionTokenDigest",
    );
    if (!user) return new Error("User not found");

    var accessToken = user.getAccessToken(this.jwt);
    var refreshToken = user.getRefreshToken(this.jwt);

    // Remove session token
    await this.repository.update(
      { _id: user._id },
      { sessionTokenDigest: undefined },
    );

    user.sessionTokenDigest = undefined;
    return { user, accessToken, refreshToken };
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
      let refreshToken = user.getRefreshToken(this.jwt);
      return { accessToken, refreshToken, user };
    }
  }

  async getNewAccessToken(refreshToken: string) {
    try {
      let decoded = this.jwt.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      if (!decoded) return new Error("Invalid refresh token");

      let user = await this.repository.get({ _id: decoded._id });
      if (!user) return new Error("User not found");

      let accessToken = user.getAccessToken(this.jwt);
      return { user, accessToken };
    } catch (error) {
      return new Error("Invalid refresh token");
    }
  }

  oauthLogin(user?: User): string | undefined {
    // Conditional to consider user as signed up
    if (user && user.email) {
      let accessToken = user.getRefreshToken(this.jwt);
      return accessToken;
    }
  }
}
