import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { UserRepository } from "../../user/user.repository";

export type AccessTokenPayload = { email: string };

// Using `process.env` instead of `ConfigService` because ConfigModule's env variables
// are only available at run time but not on the nestjs initial state.
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private repository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  /**
   * The return value from here will be appened to req.user for routes
   * that are guarded by AuthGuard('jwt')
   */
  async validate(_req: Request, payload: AccessTokenPayload) {
    var user = await this.repository.get({ email: payload.email });
    return user;
  }
}
