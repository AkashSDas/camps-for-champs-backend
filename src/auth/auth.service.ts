import { Types } from "mongoose";
import { User } from "src/user/schema";
import { UserRepository } from "src/user/user.repository";

// eslint-disable-next-line prettier/prettier
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { EmailAndPasswordSignupDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(private repository: UserRepository, private jwt: JwtService) {}

  // =====================================
  // Signup
  // =====================================

  async emailAndPasswordSignup(dto: EmailAndPasswordSignupDto) {
    // Create user
    var user: (User & { _id: Types.ObjectId }) | Error =
      await (async function createUser() {
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
}
