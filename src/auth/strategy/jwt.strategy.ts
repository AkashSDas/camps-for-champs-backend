import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "src/user/user.repository";

import { PassportStrategy } from "@nestjs/passport";

// Using `process.env` instead of `ConfigService` because ConfigModule's env variables
// are only available at run time but not on the nestjs initial state.
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private repository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter("accessToken"),
      ]),
      ignoreException: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  /**
   * The return value from here will be appened to req.user for routes
   * that are guarded by AuthGuard('jwt')
   */
  async validate(_req, payload: { sub: string }) {
    var user = this.repository.getUser({ email: payload.sub });
    return user;
  }
}
