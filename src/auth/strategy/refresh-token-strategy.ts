import { Request } from "express";
import { Strategy } from "passport-jwt";

import { PassportStrategy } from "@nestjs/passport";

export type RefreshTokenPayload = { _id: string; email: string };

export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  /**
   * The return value from here will be appened to req.user for routes
   * that are guarded by AuthGuard('jwt-refresh')
   */
  async validate(req: Request, payload: RefreshTokenPayload) {
    var refreshToken = req.cookies?.refreshToken;
    return { ...payload, refreshToken };
  }
}

function cookieExtractor(req: Request): string | undefined {
  var refreshToken = req.cookies?.refreshToken;
  return refreshToken;
}
